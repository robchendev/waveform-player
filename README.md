# waveform-player

### Description

An audio player web app that allows users to cut and loop regions of the audio waveform.

### Demonstration Video

[https://youtu.be/INExkge_hrU](https://youtu.be/INExkge_hrU)

### Design Decisions

##### Playback Controls:

I'd normally want buttons to be labeled with text about their functionality to prevent ambiguity. In this case, since there are only 4 buttons, I used icons to make it similar to a DAW's transport bar.

##### Loop:

Once entering a loopable region with the loop option turned on in a DAW, the player will begin looping. This was done in the player as well.

##### Cut:

Done similar to a DAW before export, where the original file remains untouched; only the playback and visual feedback is changed. If undo/redo functionality is needed in the future, history can be stored and manipulated with records of region parameters instead of chunks of audio data.

### Issues:

- The silenced audio divs are displayed above the wavesurfer canvas, hiding the progress indicators behind them.
- When the loop is limited, and the audio is not on the last loop, and the user clicks outside of the loop region, `region-out` gets triggered and the audio seeks to the start of the loop instead of to where the user clicked.

### Possible future improvements (out of scope)

- Add a second waveform when a stereo audio file is uploaded.
- User may want the loop button to also loop the entire track instead of just regions.
- Add undo / redo options (with hotkeys).
- Reduce local repo size by creating SVG components for icons instead of using react-icons.
- Mobile responsiveness.
