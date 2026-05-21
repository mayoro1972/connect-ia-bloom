on run argv
	if (count of argv) is not 2 then error "Usage: osascript export_powerpoint_to_pdf.applescript <input.pptx> <output.pdf>"
	set inputPath to item 1 of argv
	set outputPath to item 2 of argv
	set inputAlias to POSIX file inputPath as alias
	set outputText to POSIX path of outputPath
	
	tell application "Microsoft PowerPoint"
		activate
		open inputAlias
		delay 3
		save active presentation in outputText as save as PDF
		close active presentation saving no
	end tell
end run
