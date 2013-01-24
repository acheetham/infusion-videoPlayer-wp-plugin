<div class="embed-video-player-form">
    <div>
        <label for="infvpc-videoTitle">Video Title:</label>
        <input type='text' id='infvpc-videoTitle' />
    </div>
    <div>
        <label for="infvpc-videoUrl">Video URL:</label>
        <input type='text' id='infvpc-videoUrl' />
        <label for="infvpc-videoFormat">Format:</label>
        <select id="infvpc-videoFormat">
            <option value="">options not loaded yet</option>
        </select>
    </div>

    <h2>Captions</h2>
	<table class="infvpc-captionList infvp-captionList" border="0">
		<tr class="infvpc-captionList-row">
			<td><button class="infvpc-delete-caption">del</button></td>
			<td class="infvpc-captionList-name">name</td>
			<td class="infvpc-captionList-lang">language</td>
			<td class="infvpc-captionList-format">format</td>
		</tr>
	</table>

	<span class="infvpc-captionFormatChooserRow">
	    <label class="infvpc-captionFormatChooserLabel" for="infvpc-captionFormatChooserId">label</label>
	    <input type="radio" class="infvpc-captionFormatChooser" id="infvpc-captionFormatChooserId" >
	</span>

	<div class="infvpc-captionFormatForm infvp-captionFormatForm infvp-captionFormAmara">
		<div class="infvp-captionFormAmara">
            <label  for="infvpc-captionUrl">Caption URL:</label>
            <input type='text' id='infvpc-captionUrl' />
		</div>
		<div class="infvp-captionFormVtt">
            <label  for="infvpc-captionName">Caption File Name:</label>
            <select id="infvpc-captionName">
				<option value="">options not loaded yet</option>
            </select>
		</div>
        <label for="infvpc-captionLang">Language:</label>
        <select id="infvpc-captionLang">
			<option value="">options not loaded yet</option>
        </select>
	</div>

    <button class="infvpc-addThisCaption">Add this caption</button>

    <h2>Transcripts</h2>
	<table class="infvpc-transcriptList infvp-transcriptList" border="0">
		<tr class="infvpc-transcriptList-row">
			<td><button class="infvpc-delete-transcript">del</button></td>
			<td class="infvpc-transcriptList-name">name</td>
			<td class="infvpc-transcriptList-lang">language</td>
			<td class="infvpc-transcriptList-format">format</td>
		</tr>
	</table>

	<span class="infvpc-transcriptFormatChooserRow">
	    <label class="infvpc-transcriptFormatChooserLabel" for="infvpc-transcriptFormatChooserId">label</label>
	    <input type="radio" class="infvpc-transcriptFormatChooser" id="infvpc-transcriptFormatChooserId" >
	</span>

	<div class="infvpc-transcriptFormatForm infvp-transcriptFormatForm infvp-transcriptFormAmara">
		<div class="infvp-transcriptFormAmara">
            <label  for="infvpc-transcriptUrl">Transcript URL:</label>
            <input type='text' id='infvpc-transcriptUrl' />
		</div>
		<div class="infvp-transcriptFormJson">
            <label  for="infvpc-transcriptName">Transcript File Name:</label>
            <select id="infvpc-transcriptName">
				<option value="">options not loaded yet</option>
            </select>
		</div>
        <label for="infvpc-transcriptLang">Language:</label>
        <select id="infvpc-transcriptLang">
			<option value="">options not loaded yet</option>
        </select>
	</div>

    <button class="infvpc-addThisTranscript">Add another transcript</button>


    <div>
        <input class="infvpc-insert" type="button" name="insertonlybutton" id="insertonlybutton" class="button" value="Insert into Post"  />
    </div>
</div>

<script>infusion_vp.videoPlayerPlugin(".embed-video-player-form");</script>
