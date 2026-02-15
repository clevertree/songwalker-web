// Harp & Strings — Gentle classical piece
const harp = loadPreset("FluidR3_GM/Orchestral Harp")
const strings = loadPreset("GeneralUserGS/String Ensemble 1")
const celeste = loadPreset("GeneralUserGS/Celesta")
track.beatsPerMinute = 72

harp_arpeggios(harp)
string_bed(strings)
celeste_melody(celeste)

track harp_arpeggios(inst) {
    track.instrument = inst
    track.duration = 1/8

    // Flowing arpeggios
    C4 E4 G4 C5 G4 E4 C4 E4
    F4 A4 C5 F5 C5 A4 F4 A4
    G4 B4 D5 G5 D5 B4 G4 B4
    E4 G4 C5 E5 C5 G4 E4 G4

    C4 E4 G4 C5 G4 E4 C4 E4
    D4 F4 A4 D5 A4 F4 D4 F4
    G3 B3 D4 G4 D4 B3 G3 B3
    C4 E4 G4 C5 /2
}

track string_bed(inst) {
    track.instrument = inst
    track.duration = 1

    // Sustained harmonies
    [C3, G3] /2
    [F3, C4] /2
    [G3, D4] /2
    [C3, G3] /2

    [C3, G3] /2
    [D3, A3] /2
    [G2, D3] /2
    [C3, G3] /2
}

track celeste_melody(inst) {
    track.instrument = inst
    track.duration = 1/4

    // Delicate melody entering after 2 bars
    . /4
    E5 /4  G5 /4  C6 /4
    B5 /2  A5 /2
    G5 /1

    E5 /4  F5 /4  G5 /4  A5 /4
    G5 /2  E5 /2
    D5 /2  . /2
    C5 /2
}
