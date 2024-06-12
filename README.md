# waveform-player

### Read me will be updated later

### Issues:

- The silenced audio divs are displayed above the wavesurfer canvas, hiding the progress indicators behind them.
- When the loop is limited, and the audio is not on the last loop, and the user clicks outside of the loop region, `region-out` gets triggered and the audio seeks to the start of the loop instead of to where the user clicked.
