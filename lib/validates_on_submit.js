function add_validator(id){
	new Validator(id);
}


// =======Validator CLASS=======
var Validator = Class.create({
    initialize: function(id) {
        this.form = $(id);
        this.json = [' '];
        this.change_submit();
    },
    
    
    change_submit: function() {
      old_submit = this.form.onsubmit;
      var validator = this;
      this.form.onsubmit = function() {
        validator.clear_messages();
        if(validator.validate())
          old_submit();
          return false;
        }
    },
    

    
    clear_messages: function() {
      $$('#'+this.form.id+' input').each(function(field){
        if (!field.id.blank() && field.next('.error'))
          field.next('.error').update('');
      })
    },
    
    
    field_id: function(attr) {
      return this.object_name() + "_" + attr;
    },
        
    
    form_action: function() {
      var split = this.form.action.split('/');
      var path = split.last().match(/\d+/) ? split[split.length -2] : split.last();
      return path+ '/validator';
    },
    
    
    object_id: function() {
      return this.form.id.match(/\d+/);
    },
    
    
    object_name: function() {
      return this.form.className.split(/^(new_|edit_)/).last();
    },
    
    
    parameters: function() {
      return Form.serialize(this.form) + '&object_name='+ this.object_name() + "&id="+ this.object_id();
    },
    
    
    process_errors: function(response) {
      var validator = this;
      this.json = $A(response.responseJSON);
      
      this.json.each(function(error) {
        error = error.toString();
        attr = error.split(',').first();
        msg = error.split(',').last();
        validator.show_error(attr, msg);
      });
    },
    
    
    show_error: function(attr, msg) {
      message = msg.blank() ? ' ' : msg;
      try { 
        $(this.field_id(attr)).next('.error').update(message);
      } catch(e) {
        html_msg = '<span class="error">' +message+ '</span>';
        new Insertion.After($(this.field_id(attr)), html_msg);
      };
    },
    
    
    validate: function() {
      new Ajax.Request(
        this.form_action(),
        {asynchronous: false, method: 'get', onComplete: this.process_errors.bindAsEventListener(this), parameters:this.parameters()});
        return (this.json.size() > 0);
    }
});
//==============================