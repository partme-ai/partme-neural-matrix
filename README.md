# Partme Neural Matrix V3

Enterprise blue-white Agent Fabric visualization demo.

## Contents
- src/: maintainable HTML, CSS, JavaScript, and audio controller source.
- scripts/: standalone build and original audio-generation scripts.
- tests_v3.py, verification/: browser test source and captured validation reports.
- media/partme-neural-matrix-v3-bluewhite-40s.mp4: 40-second H.264/AAC showcase video.
- partme-neural-matrix-v3.html: standalone, self-contained browser build when generated with scripts/build_standalone.py.

## Run
Open src/index.html through a local static server for development. To build the standalone HTML, provide the two audio files under src/assets/ and run python scripts/build_standalone.py.

The media/.incoming/ transfer staging area is intentionally excluded from Git.

## Notes
The visual runtime currently uses simulated Agent/Runtime events. It is a presentation demo, not connected to live Agent Fabric telemetry. Browser audio playback may require a user gesture due to autoplay policy.
