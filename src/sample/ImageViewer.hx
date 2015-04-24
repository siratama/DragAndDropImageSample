package sample;

import jQuery.JQuery;

class ImageViewer
{
	private var element:JQuery;
	private var imageElement:JQuery;

	public function new()
	{
		element = new JQuery("#image_viewer");
		imageElement = new JQuery("<img>").appendTo(element);
	}
	public function show(imageSourceUri:String)
	{
		imageElement.attr("src", imageSourceUri);
	}
}

