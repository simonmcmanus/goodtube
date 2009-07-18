"""
def homepage(environ, start_response):
	return "Holla"
A quick plugin to demonstrate creating
recipes on the fly.
"""

from tiddlyweb import control
from tiddlyweb.model.bag import Bag
from tiddlyweb.model.recipe import Recipe
from tiddlyweb.web.sendtiddlers import send_tiddlers

def user_page(environ, start_response): 
    print(environ)
    name = environ['wsgiorg.routing_args'][1].get('name', 'default')
    recipe = Recipe('tmp')
    recipe.set_recipe([
        [name, '']
   	     ]) 
    # establish the store on the recipe so that get_tiddlers_from_recipe
    # will load the bags and their tiddler lists from the store
    recipe.store = environ['tiddlyweb.store']
    tiddlers = control.get_tiddlers_from_recipe(recipe, environ)
    bag = Bag('tmp', tmpbag=True)
    bag.add_tiddlers(tiddlers)
    return send_tiddlers(environ, start_response, bag)

def init(config):
   config['selector'].add('/{name}', GET=user_page) 
   config['selector'].add('/user/{name}', GET=user_page)
