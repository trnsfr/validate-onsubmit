module DrBoolean
  module ValidatesOnSubmit    
    module Helper  
      def js_validate(object)
        prefix = object.new_record? ? 'new' : 'edit'
        form_id = [prefix, object.class.name.instantize, object.id].compact.join('_')
        javascript_tag "add_validator('#{form_id}');"
      end
    end
  
  
    def validator
      model = params[:object_name].modelize
      obj = (model.find_by_id(params[:id]) || model.new)
      obj.attributes = params[params[:object_name]]
      obj.valid?
      render(:json => (obj.errors || []).map, :status => :unprocessable_entity, :content_type => 'application/json')
    end
  end
end
