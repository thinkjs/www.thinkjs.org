export default {
  route_parse: ['prepend', 'get_lang'],
  view_parse: ['append', 'replace_image'],
  response_end: ['append', 'log_request']
}