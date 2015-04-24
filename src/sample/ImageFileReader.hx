package sample;
import js.html.File;
import js.html.Event;
import js.html.FileReader;

enum ImageFileReaderEvent
{
	NONE;
	READ(data:String);
}

class ImageFileReader
{
	private var fileReader:FileReader;

	private var event:ImageFileReaderEvent;
	public function getEvent():ImageFileReaderEvent
	{
		var n = event;
		event = ImageFileReaderEvent.NONE;
		return n;
	}

	public function new()
	{
		fileReader = new FileReader();
		fileReader.addEventListener("load", onLoadFile);
		event = ImageFileReaderEvent.NONE;
	}
	private function onLoadFile(event:Event)
	{
		this.event = ImageFileReaderEvent.READ(untyped event.target.result);
	}

	public function start(file:File)
	{
		fileReader.readAsDataURL(file);
	}
}
