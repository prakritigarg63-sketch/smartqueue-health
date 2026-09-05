# Hero image assets

## Present

| File | Used by | Notes |
| --- | --- | --- |
| `smartqueue-hospital-hero.webp` | `HospitalBackground` | 1536 × 1024, 108 KB. What browsers actually fetch. |
| `smartqueue-hospital-hero.png` | `HospitalBackground` | The original supplied file, 1.8 MB. Kept only as the `<picture>` fallback — do not reference it directly. |

The PNG was 1.8 MB, which is far too heavy to sit behind a hero, so it is
served through a `<picture>` element with a WebP source at the same pixel
dimensions. If you replace the photograph, re-encode it the same way.

## Still needed

| File | Used by | Behaviour while absent |
| --- | --- | --- |
| `smartqueue-doctor-mascot.png` | `DoctorMascotImage` | Renders **nothing**. No drawn fallback. |

Export the mascot on transparency at roughly 320 × 470 (2× the rendered size)
so it stays sharp; it is never upscaled past its native resolution. The slot,
its position beside the phone, and the idle-float animation are already wired —
dropping the file in is the whole job.

## How the photograph is composed

The hero uses the photograph as a real background layer, not a decorative
panel, so three things are tuned together in `Hero.tsx`:

1. **Crop.** The image is rendered at `w-[112%]` pinned to the right edge
   (`HospitalBackground`). Wider than the frame and right-anchored walks the
   group leftward out of the phone's footprint, which is what puts the elderly
   patient's face in the gap between the copy and the device while keeping the
   OPD sign in shot.
2. **Readability overlay.** A 90° gradient holds the left side near-opaque and
   releases by ~56%. It grades the photograph rather than fading it out, so the
   right side stays at full strength.
3. **Device halo.** A small radial pool sits behind the phone only, roughly its
   own footprint. The photograph itself is never blurred.

Changing any one of these without the others will either wash out the copy or
bury the people. If you swap the photograph for a differently-composed one,
re-check the crop percentage first — it is the lever that decides who is
visible beside the phone.

## A known limitation of this photograph

Its three subjects sit across the middle of the frame (faces at roughly
45–75% of the image width). The phone occupies the middle of the layout. There
is no crop of this image where a 368 px device in the centre-right clears all
three faces at once.

The current tuning shows **the elderly patient's face, the doctor, the OPD sign
and the plant**, and places the attendant behind the device. If having the
attendant visible matters more than the patient, reduce the `w-[112%]` in
`HospitalBackground` toward `w-[104%]`. A right-weighted re-crop of the source
photo — subjects pushed into the right 45% of the frame — removes the trade-off
entirely and needs no code change beyond resetting that width to `w-full`.
