
from jinja2 import Environment, FileSystemLoader
from tiddlyweb.web import util as web

def homepage(environ, start_response):
        template_env = Environment(loader=FileSystemLoader('templates/new'))
        return template_env.get_template('newTheme.html');



def _generate_response(content, environ, start_response):
  serialize_type, mime_type = web.get_serialize_type(environ) # XXX: not suitable here!?
  cache_header = ("Cache-Control", "no-cache") # ensure accessing latest HEAD revision
  content_header = ("Content-Type", mime_type) # XXX: should be determined by diff format
  response = [cache_header, content_header]
  start_response("200 OK", response)
  return [content]
 
def replace_handler(selector, path, new_handler):
    for index, (regex, handler) in enumerate(selector.mappings):
        if regex.match(path) is not None:
            selector.mappings[index] = (regex, new_handler)

def init(config):
    replace_handler(config['selector'], '/', dict(GET=homepage))

