import { importTypes } from '@rancher/auto-import';
import { IPlugin, TableColumnLocation } from '@shell/core/types';
import neuvectorRouting from './routing/neuvector-routing';

// Init the package
export default function(plugin: IPlugin) {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide extension metadata from package.json
  // it will grab information such as `name` and `description`
  plugin.metadata = require('./package.json');

  // Load NeuVector
  plugin.addProduct(require('./neuvector'));

  // Add Vue Routes
  plugin.addRoutes(neuvectorRouting);

  plugin.addTableColumn(
    TableColumnLocation.RESOURCE,
    { path: [{ urlPath: 'explorer/node', endsWith: true }] },
    {
      name:     'some-prop-col',
      labelKey: 'dashboard.VULNERBILITIES',
      getValue: (row: any) => row,
      width: 100,
      formatter: 'NodeVulnerabilitySummary',
      sort: ['stateSort', 'nameSort'],
      search: ['stateSort', 'nameSort'],
    }
  );
}
