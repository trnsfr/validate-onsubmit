# Include hook code here
require 'validates_on_submit'
ActionView::Helpers.send(:include, DrBoolean::ValidatesOnSubmit::Helper)
