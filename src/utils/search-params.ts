import qs from 'qs';

const qsStringifyOptions: qs.IStringifyOptions = {
  addQueryPrefix: true,
  arrayFormat: 'comma',
  encode: false
}

const qsParseOptions: qs.IParseOptions = {
  ignoreQueryPrefix: true,
  comma: true
}

export default {
  parse: (query: string) => {
    return qs.parse(query, qsParseOptions) || {}
  },

  stringify: (params: any) => {
    return qs.stringify(params, qsStringifyOptions);
  }
}
