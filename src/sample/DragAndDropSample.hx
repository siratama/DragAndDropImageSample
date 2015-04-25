package sample;

import sample.ImageFileReader.ImageFileReaderEvent;
import sample.DropZone.DropZoneEvent;
import js.html.File;
import haxe.Timer;
import jQuery.JQuery;

class DragAndDropSample
{
	private var mainFunction:Void->Void;
	private var timer:Timer;

	private var dropZone:DropZone;
	private var imageFileReader:ImageFileReader;
	private var imageViewer:ImageViewer;

	public static function main()
	{
		new DragAndDropSample();
	}
	public function new()
	{
		new JQuery(function(){ initialize(); });
	}
	public function initialize()
	{
		dropZone = new DropZone();
		imageFileReader = new ImageFileReader();
		imageViewer = new ImageViewer();

		mainFunction = waitToDropImageFile;
		timer = new Timer(100);
		timer.run = run;
	}
	public function run()
	{
		mainFunction();
	}
	private function waitToDropImageFile()
	{
		var event = dropZone.getEvent();
		switch(event){
			case DropZoneEvent.NONE: return;
			case DropZoneEvent.DROP_FILE_ERROR(message):
				js.Lib.alert(message);
			case DropZoneEvent.DROPPED(file):
				initializeToReadImageFile(file);
		}
	}

	private function initializeToReadImageFile(file:File)
	{
		imageFileReader.start(file);
		mainFunction = readImageFile;
	}
	private function readImageFile()
	{
		var event = imageFileReader.getEvent();
		switch(event){
			case ImageFileReaderEvent.NONE: return;
			case ImageFileReaderEvent.READ(data):
				imageViewer.show(data);
				mainFunction = waitToDropImageFile;
		}
	}
}
