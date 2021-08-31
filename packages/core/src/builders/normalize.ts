import { DEFAULT_COMPONENT_API_DIR, DEFAULT_COMPONENT_DOC_DIR, DEFAULT_COMPONENT_EXAMPLES_DIR, DEFAULT_LABEL_CONFIG } from '../constants';
import { DocgeniLibrary, Library } from '../interfaces';

export function normalizeLibConfig(lib: DocgeniLibrary): Library {
    return {
        name: lib.name,
        rootDir: lib.rootDir || '',
        abbrName: lib.abbrName || lib.name,
        include: lib.include || [],
        exclude: lib.exclude || [],
        docDir: lib.docDir || DEFAULT_COMPONENT_DOC_DIR,
        apiDir: lib.apiDir || DEFAULT_COMPONENT_API_DIR,
        examplesDir: lib.examplesDir || DEFAULT_COMPONENT_EXAMPLES_DIR,
        categories: lib.categories || [],
        labels: {
            ...DEFAULT_LABEL_CONFIG,
            ...(lib.labels instanceof Array
                ? lib.labels.reduce((obj, item) => {
                      obj[item.id] = { text: item.text, color: item.color };
                      return obj;
                  }, {})
                : lib.labels || {})
        }
    };
}
