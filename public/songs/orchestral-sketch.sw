// Orchestral Sketch — Strings and brass ensemble
const strings = loadPreset("FluidR3_GM/String Ensemble 1")
const brass = loadPreset("FluidR3_GM/Brass Section")
const timpani = loadPreset("FluidR3_GM/Timpani")
track.beatsPerMinute = 88

strings_part(strings)
brass_part(brass)
timpani_part(timpani)

track strings_part(inst) {
    track.instrument = inst
    track.duration = 1/2

    // Majestic opening
    [C3, G3, E4] /1
    [D3, A3, F4] /1
    [E3, B3, G4] /2  [D3, A3, F4] /2
    [C3, G3, E4] /1

    // Rising passage
    [F3, C4, A4] /1
    [G3, D4, B4] /1
    [A3, E4, C5] /2  [G3, D4, B4] /2
    [C3, G3, C4, E4] /2
}

track brass_part(inst) {
    track.instrument = inst
    track.duration = 1/4

    // Fanfare enters after 2 bars
    . /2
    . /2
    G4 /2  A4 /4  B4 /4
    C5 /1

    C5 /4  B4 /4  A4 /4  G4 /4
    A4 /2  B4 /2
    C5 /2  D5 /2
    E5 /2
}

track timpani_part(inst) {
    track.instrument = inst
    track.duration = 1/4

    C2 *0.8 /1
    . /1
    . /1
    C2 *0.6 /2  G2 *0.6 /2

    C2 *0.8 /1
    . /1
    C2 *0.5 /4  C2 *0.5 /4  C2 *0.7 /4  G2 *0.7 /4
    C2 *0.9 /2
}
