
def MyCustomHTMLPresenter(object): 
	return ['dd']

def init(config):
    config['server_response_filters'][0] = MyCustomHTMLPresenter
