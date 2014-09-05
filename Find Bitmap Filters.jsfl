flash.outputPanel.clear();
fl.showIdleMessage(false);

var data;
var doc = flash.getDocumentDOM();
for each(var item in doc.library.items)
{
	if ("timeline" in item)
	{		
		data = {msg:item.name, list:[]};
		
		doc.library.selectItem(item.name);
		doc.library.editItem();
		
		var layer;
		for (var l = 0; l < item.timeline.layerCount; l++)
		{
			layer = item.timeline.layers[l];
			
			var ld = {list:[], parent:data};
			ld.msg = "L" + (l + 1) + ":" + layer.name ;
			
			var frame, num = 0;
			for (var f = 0; f < layer.frames.length; f++)
			{
				frame = layer.frames[f];
				item.timeline.setSelectedFrames(num, frame.duration);		
				
				var fd = {list:[], parent:ld};
				fd.msg = "F" + (num + 1);
				
				var element;
				for (var e = 0; e < frame.elements.length; e++)
				{
					element = frame.elements[e];					
					
					doc.selection = [element];
					
					var ed = {list:[], parent:fd, msg:"E" + (e + 1) + "."};
					if (element.libraryItem)
					{
						ed.msg += "[" + element.libraryItem.name + ":" + element.libraryItem.itemType + "]";
					}
					
					ed.msg += "[" + (element.instanceType || element.elementType) + "]" + element.name;
					if (element.elementType == "text") ed.msg += " =" + element.getTextString(0);
					
					var list = doc.getFilters();
					if (list.length)
					{
						for (var i = 0; i < list.length; i++)
						{
							var dd = {parent:ed}
							dd.msg = filterText(list[0]);
							ed.list.push(dd);
						}
					}
					
					if (ed.list.length > 0) fd.list.push(ed);					
				}
				
				num += frame.duration;
				if (fd.list.length > 0) ld.list.push(fd);
			}			
			
			if (ld.list.length > 0) data.list.push(ld);
		}
		
		if (data.list.length > 0) 
		{
			trace(data.msg + format(data.list, ""));
		}
	}
}

flash.outputPanel.save(doc.pathURI + ".txt");

// 格式化描述数据
function format(data, prefix)
{
	var result = "";	
	if (data && data.length)
	{
		var item;
		for (var i = 0; i < data.length; i++)
		{
			item = data[i];
			result += "\n" + prefix + (i < data.length - 1? "├" : "└") + "──" + item.msg;
			
			if (item.list)
			{
				result += arguments.callee(item.list, prefix + (i < data.length - 1? "│" : " ") + "  ");
			}
		}
	}
	
	return result;
}

function filterText(filter)
{
	var list = [];
	for (var key in filter)
	{
		list.push(key + ":" + filter[key]);
	}
	
	return "{" + list.join(", ") + "}";
}

function trace()
{
	var list = []
	for (var i = 0; i < arguments.length; i++)
	{
		list.push(String(arguments[i]));
	}
	
	flash.trace(list.join(", "));
}