def homepage(environ, start_response):
	generate_response('bong', environ, start_response);


def _generate_response(content, environ, start_response):
  serialize_type, mime_type = web.get_serialize_type(environ) # XXX: not suitable here!?
  cache_header = ("Cache-Control", "no-cache") # ensure accessing latest HEAD revision
  content_header = ("Content-Type", 'text/html') # XXX: should be determined by diff format
  response = [cache_header, content_header]
  start_response("200 OK", response)
  return [content]
 

def init(config):
    config['selector'].add('/', GET=homepage)
