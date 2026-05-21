on run argv
	if (count of argv) is not 2 then error "Usage: osascript export_word_to_pdf.applescript <input.docx> <output.pdf>"
	set inputPath to item 1 of argv
	set outputPath to item 2 of argv
	set inputAlias to POSIX file inputPath as alias
	set outputFile to POSIX file outputPath
	
	tell application "Microsoft Word"
		activate
		open inputAlias
		delay 2
		save as active document file name outputFile file format format PDF
		close active document saving no
	end tell
end run
