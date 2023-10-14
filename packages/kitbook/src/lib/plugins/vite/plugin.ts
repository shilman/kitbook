import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import type { KitbookSettings } from 'kitbook'
import { initKitbook } from './initKitbook.js'
import { modifyViteConfigForKitbook } from './modifyViteConfigForKitbook.js'
import { DEFAULT_IMPORT_MODULE_GLOBS, DEFAULT_KITBOOK_ROUTE, DEFAULT_ROUTES_DIR, DEFAULT_VIEWPORTS, RESOLVED_VIRTUAL_MODULES_IMPORT_ID, RESOLVED_VIRTUAL_SETTINGS_IMPORT_ID, VIRTUAL_MODULES_IMPORT_ID, VIRTUAL_SETTINGS_IMPORT_ID } from './constants.js'
import { writeModuleGlobsIntoVirtualModuleCode } from './writeModuleGlobsIntoVirtualModuleCode.js'
import { kitbookViewer } from './viewer/index.js'

// import virtualImportModulesContent from './virtual/importModulesStringified'

/**
 * Vite plugin to add a Kitbook to SvelteKit projects. Will automatically add Kitbook routes to `src/routes/kitbook` unless you update the `routesDirectory` and `kitbookRoute` settings.
 */
export function kitbook(userSettings: Partial<KitbookSettings> = {}): Plugin[] {
  const settings: KitbookSettings = {
    title: 'Kitbook',
    description: 'Component workbench',
    viewports: DEFAULT_VIEWPORTS,
    routesDirectory: DEFAULT_ROUTES_DIR,
    kitbookRoute: DEFAULT_KITBOOK_ROUTE,
    ...userSettings,
  }
  initKitbook(settings)

  const plugin: Plugin = {
    name: 'vite-plugin-svelte-kitbook',
    enforce: 'pre',

    config: modifyViteConfigForKitbook,

    resolveId(id) {
      if (id === VIRTUAL_SETTINGS_IMPORT_ID)
        return RESOLVED_VIRTUAL_SETTINGS_IMPORT_ID

      if (id === VIRTUAL_MODULES_IMPORT_ID)
        return RESOLVED_VIRTUAL_MODULES_IMPORT_ID
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_SETTINGS_IMPORT_ID)
        return `export const settings = ${JSON.stringify(settings)}`

      if (id === RESOLVED_VIRTUAL_MODULES_IMPORT_ID) {
        const filepath = resolve(__dirname, './virtual/importModules.ts')
        const content = readFileSync(filepath, 'utf-8')
        return writeModuleGlobsIntoVirtualModuleCode(content, settings.importModuleGlobs || DEFAULT_IMPORT_MODULE_GLOBS)
        // return writeModuleGlobsIntoVirtualModuleCode(virtualImportModulesContent, settings.importModuleGlobs || DEFAULT_IMPORT_MODULE_GLOBS)
      }
    },
  }

  return [plugin, kitbookViewer(settings)]
}