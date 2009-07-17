from jinja2 import Environment, FileSystemLoader,  FunctionLoader, PackageLoader

from tiddlyweb.web import util as web

def homepage(environ, start_response):
	template_env = Environment(loader=FileSystemLoader('templates/new'))
	template = template_env.get_template('newTheme.html')
	return _generate_response(template.render(), environ, start_response)


def _generate_response(content, environ, start_response):
	cache_header = ("Cache-Control", "no-cache") # THIS NEEDS CHANGING
	content_header = ('Content-Type', 'text/html; charset=UTF-8')
	response = [cache_header, content_header]
	start_response("200 OK", response)
	return [content]
 
def replace_handler(selector, path, new_handler):
	for index, (regex, handler) in enumerate(selector.mappings):
		if regex.match(path) is not None:
			selector.mappings[index] = (regex, new_handler)

def init(config):
	replace_handler(config['selector'], '/', dict(GET=homepage))
  

