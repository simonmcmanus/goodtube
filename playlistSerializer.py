 
from jinja2 import Environment, FileSystemLoader
 
import logging, urllib
 
from tiddlyweb.wikklyhtml import wikitext_to_wikklyhtml
from tiddlyweb.serializations import SerializationInterface
from tiddlyweb.model.bag import Bag
from tiddlyweb.web.util import encode_name

 
EXTENSION_TYPES = { 'hi': 'text/html' }
SERIALIZERS = {
        'text/html': ['hi', 'text/html; charset=UTF-8']
        }
 
class Serialization(SerializationInterface):
 
    def __init__(self, environ=None):
        if environ is None:
            environ = {}
        self.environ = environ
        self._init()
 
    def _init(self):
        template_env = Environment(loader=FileSystemLoader('templates'))
        self.template = template_env.get_template('playlist.html')
 
    def list_bags(self, bags):
        """
        List the bags on the system as html.
        """
        self.environ['tiddlyweb.title'] = 'Bags'
        lines = []
        output = '<ul id="bags" class="listing">\n'
        for bag in bags:
            line = '<li><a href="bags/%s">%s</a></li>' % (
                    encode_name(bag.name), bag.name)
            lines.append(line)
        output += "\n".join(lines)
        return output + '\n</ul><h1>h1</h1>'

    def bag_as(self, bag):
        """
        List the bags on the system as html.
        """
        self.environ['tiddlyweb.title'] = 'Bags'
        lines = []
        output = '<ul id="bags" class="listing">\n'
        for bag in bags:
            line = '<li><a href="bags/%s">%s</a></li>' % (
                    encode_name(bag.name), bag.name)
            lines.append(line)
        output += "\n".join(lines)
        return output + '\n</ul><h1>h1</h1>'



    def tiddler_as(self, tiddler):
        template_env = Environment(loader=FileSystemLoader('templates'))
	self.template = template_env.get_template('autoPlayRelated.html')
        bag = Bag('tmpbag', tmpbag=True)
        bag.add_tiddler(tiddler)
        return self.list_tiddlers(bag)
 
    def list_tiddlers(self, bag):
        tiddlers = bag.list_tiddlers()
        title = DEFAULT_TITLE
        subtitle = DEFAULT_SUBTITLE
        presenter = DEFAULT_PRESENTER
        affiliation = DEFAULT_AFFILIATION
        time_location = DEFAULT_TIME_LOCATION
        slides = {}
        slide_order = None
        original_slide_order = []
        for tiddler in tiddlers:
            slides[tiddler.title] = tiddler
            original_slide_order.append(tiddler.title)
            tiddler.html = unicode(wikitext_to_wikklyhtml('tiddlers/', '', tiddler.text), 'utf-8')
 

        return self.template.render(slides=slides,
                slide_order=slide_order,
                title=title,
                subtitle=subtitle,
                presenter=presenter,
                affiliation=affiliation,
                time_location=time_location)
 
 
def init(config):
    config['extension_types'].update(EXTENSION_TYPES)
    config['serializers'].update(SERIALIZERS)
 
