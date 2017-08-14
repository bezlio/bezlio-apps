define(function () {
    function Refresh (bezl) {
        bezl.vars.config.refreshing = true;
        bezl.dataService.process('directory');
    }

    function RegenerateOutput (bezl) {
        eval(bezl.vars.config.outputFormula);
        
        // This function will be used to "flatten" out the values when multiple levels of grouping were
        // used
        var rollupValues = function(obj, returnValues) {
          obj.forEach(o => {
            if (o.values) {
              rollupValues(o.values, returnValues);
            } else {
              returnValues.push(o);
            }
          });
        }
        
        // Now add in each of the summarized fields at each group level
        // obj:           This is the actual property we are evaluating.  It starts off as the entire
        //                data object and then crawls through each values sub object.
        // sequence:      This helps us to marry up which piece of the data object we are looking
        //                at as compared to the structure object.  This is incremented by 1 for each
        //                level deeper we go.
        // config:        A reference to the config object.  Does not change in the process,
        //                simply needed as a reference since the recursive function is out of scope.
        // parentUid:     A reference to the parent object UID.
        // dataIterator:  A reference to the dataIterator object we are populating.
        var processValues = function(obj, sequence, config, parentUid, dataIterator) {
          var s = config.structure.find(s => s.sequence == sequence);
        
          if (obj.length > 0 && obj[0].values && obj[0].values.length > 0)
          {
            obj.forEach(o => {
              o.sequence = sequence;
              o.uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                          return v.toString(16);
                      });
              var nextIsGroup = config.structure.find(s => s.sequence == sequence + 1 && s.type == 'group');
        
              var values = [];
              if (nextIsGroup) {
                rollupValues(o.values, values);
              } else {
                values = o.values;
              }
        
              dataIterator.push({ sequence: sequence, data: o, columns: s.columns, type: s.type, selected: false, parentUid: parentUid, uid: o.uid });
        
              s.columns.forEach(col => {
                switch (col.summaryOperation) {
                    case 'first':
                        o[col.columnId] = values[0][col.columnName];
                        break;
                    case 'last':
                        o[col.columnId] = values[o.values.length - 1][col.columnName];
                        break;
                    case 'count':
                        o[col.columnId] = values.length;
                        break;
                    case 'min':
                        o[col.columnId] = d3.min(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'max':
                        o[col.columnId] = d3.max(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'extent':
                        o[col.columnId] = d3.extent(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'sum':
                        o[col.columnId] = d3.sum(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'mean':
                        o[col.columnId] = d3.mean(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'median':
                        o[col.columnId] = d3.median(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'variance':
                        o[col.columnId] = d3.variance(values, function (d) { return d[col.columnName]; });
                        break;
                    case 'deviation':
                        o[col.columnId] = d3.deviation(values, function (d) { return d[col.columnName]; });
                        break;
                    default:
                        o[col.columnId] = values[0][col.columnName];
                        break;
                }
              });
        
              processValues(o.values, sequence + 1, config, o.uid, dataIterator);
            });
          } else {
            obj.forEach(o => {
              o.sequence = sequence;
                dataIterator.push({ sequence: sequence, data: o, columns: s.columns, type: s.type, selected: false, parentUid: parentUid });
            });
          }
        };
        
        // Use a temp object for processing the data that we point back to
        // when done to trigger Angular change detection
        var tempData = bezl.vars.data;
        bezl.vars.dataIterator = [];
        processValues(tempData, 1, bezl.vars.config, '', bezl.vars.dataIterator);
        bezl.vars.data = tempData;
        
        // Apply sorts
        bezl.vars.config.structure.forEach(s => {
          s.columns.forEach(c => {
            if (c.sort != '') {
              Sort(bezl, { section: s, column: c, sequence: s.sequence, initial: true });
            }
          });
        });
    }

    function Sort(bezl, parm) {
        var tempData = bezl.vars.dataIterator;
        var section = parm.section;
        var column = parm.column;
        var sequence = parm.sequence;
        var initial = parm.initial;
        
        
        // Set the column sort direction unless this is the initial sorting
        if (!initial) {
          if (!column.sort && (column.formatter.type == 'currency' || column.formatter.type == 'number' || column.formatter.type == 'percent')) {
            column.sort = 'descending';
          } else if (!column.sort || column.sort == 'descending') {
            column.sort = 'ascending';
          } else if (column.sort == 'ascending') {
            column.sort = 'descending';
          }
        }
        
        // Also zap any previous sort indicators
        section.columns.forEach(col => {
          if (col != column) {
            col.sort = '';
          }
        });
        
        // First index all of the entries
        for (var i = 0; i < tempData.length; i++) {
          tempData[i].index = i;
        }
        
        // Next sort by sequence so we can clump together same-level data
        tempData.sort(function(a, b) { return a.sequence - b.sequence; });
        
        // Now locate the stop and start positions of the sequence level we are sorting
        var start = tempData.findIndex(r => r.sequence == sequence);
        var end = tempData.slice(start, tempData.length).findIndex(r => r.sequence != sequence);
        if (end == -1) {
          end = tempData.length;
        }
        
        // Store the unsorted elements before and after our sequence level
        var pre = tempData.slice(0, start);
        pre.sort(function(a, b) { return a.index - b.index; });
        var post = tempData.slice(start, tempData.length).slice(end, tempData.length);
        post.sort(function(a, b) { return a.index - b.index; });
        
        // Now sort the sequence level
        var sorted = tempData.slice(start, end).sort(function(a, b) {
          if (column.formatter.type == 'currency' || column.formatter.type == 'number' || column.formatter.type == 'percent') {
            // Push the nulls to the bottom
            if ((a.data[column.columnId] || a.data[column.columnName]) == null) {
              return 1;
            } else if ((b.data[column.columnId] || b.data[column.columnName]) == null) {
              return -1;
            }
        
            if (column.sort == 'descending') {
              var A = (a.data[column.columnId] || a.data[column.columnName]) != null ? (a.data[column.columnId] || a.data[column.columnName]) : Number.MAX_VALUE;
              var B = (b.data[column.columnId] || b.data[column.columnName]) != null ? (b.data[column.columnId] || b.data[column.columnName]) : Number.MAX_VALUE;
              return B - A;
            } else {
              var A = (a.data[column.columnId] || a.data[column.columnName]) != null ? (a.data[column.columnId] || a.data[column.columnName]) : Number.MAX_VALUE;
              var B = (b.data[column.columnId] || b.data[column.columnName]) != null ? (b.data[column.columnId] || b.data[column.columnName]) : Number.MAX_VALUE;
              return A - B;
            }
          } else {
            var A = (a.data[column.columnId] || a.data[column.columnName] || '').toString().toUpperCase(); // ignore upper and lowercase
            var B = (b.data[column.columnId] || b.data[column.columnName] || '').toString().toUpperCase(); // ignore upper and lowercase
        
            if (column.sort == 'ascending') {
              if (A < B) {
                  return -1;
              }
              if (A > B) {
                  return 1;
              }
            } else {
              if (A > B) {
                  return -1;
              }
              if (A < B) {
                  return 1;
              }
            }
        
            // names must be equal
            return 0;
          }
        });
        
        // Reconstruct the array.  If the sequence is greater than 1 then reverse
        // the sorted object so we can put them back under the parent last to first
        if (sequence == 1) {
          tempData = pre.concat(sorted).concat(post);
        } else {
          tempData = pre.concat(sorted.reverse()).concat(post);
        }
        
        var moveElement = function (array, old_index, new_index) {
          if (new_index >= array.length) {
              var k = new_index - array.length;
              while ((k--) + 1) {
                  array.push(undefined);
              }
          }
          array.splice(new_index, 0, array.splice(old_index, 1)[0]);
        };
        
        // Now put the child records back inline with parents
        tempData.forEach(row => {
          if (row.sequence >= sequence) {
            var parent = tempData.find(t => t.uid == row.parentUid);
            if (parent) {
              moveElement(tempData, tempData.indexOf(row), tempData.indexOf(parent) + 1);
            }
          }
        });
        
        bezl.vars['dataIterator'] = tempData;
    }

    function SelectRow(bezl, parm) {
        var row = parm;
        var selected = !row.selected;
        row.selected = selected;
        
        var keepGoing = true;
        var i = bezl.vars['dataIterator'].indexOf(row) + 1;
        while (keepGoing) {
          if (i < bezl.vars['dataIterator'].length) {
            if (bezl.vars['dataIterator'][i].sequence == row.sequence + 1) {
              bezl.vars['dataIterator'][i].show = selected;
            } else if (bezl.vars['dataIterator'][i].sequence <= row.sequence + 1) {
              keepGoing = false;
            }
          }
          if (i < bezl.vars['dataIterator'].length - 1) {
            i++;
          } else {
            keepGoing = false;  
          }
          
        }
    }

    return {
        refresh: Refresh,
        regenerateOutput: RegenerateOutput,
        sort: Sort,
        selectRow: SelectRow
    }
});
