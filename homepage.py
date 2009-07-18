from jinja2 import Environment, FileSystemLoader
 
from tiddlywebplugins import replace_handler
 
 
def init(config):
  replace_handler(config["selector"], "/", dict(GET=homepage))
 
 
def homepage(environ, start_response):
  template_env = Environment(loader=FileSystemLoader("templates"))
  template = template_env.get_template("liquid.html")
  return _generate_response(template.generate(), environ, start_response)
 
 
def _generate_response(content_generator, environ, start_response):
  content_header = ("Content-Type", "text/html; charset=UTF-8")
  response = [content_header]
  start_response("200 OK", response)
  return content_generator
