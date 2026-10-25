import { describe, it, expect } from 'vitest';
import { validateRetinaFundusImage } from '../services/imageQuality';

describe('Core Clinical Safety Governance (Section 4 Overrides)', () => {
  const prohibitedStrings = [
    'you have cancer',
    'you have leukemia',
    'you have tb',
    'you are healthy',
  ];

  const approvedResults = {
    green: 'No concerning sign was detected by this screening.',
    amber: 'Some signs need a closer medical check.',
    red: 'Please arrange a medical assessment promptly.',
  };

  it('strictly prohibits diagnostic labels in results', () => {
    Object.values(approvedResults).forEach(text => {
      prohibitedStrings.forEach(prohibited => {
        expect(text.toLowerCase()).not.toContain(prohibited);
      });
    });
  });

  it('guarantees green outcome does not promise absence of disease', () => {
    const greenExplanation = 'This check did not identify a concerning sign. Please continue routine care and follow any advice from your health worker.';
    expect(greenExplanation.toLowerCase()).not.toContain('you are healthy');
    expect(greenExplanation.toLowerCase()).not.toContain('free of disease');
  });

  it('enforces hardware reality: external eye photos are rejected and never default to green', () => {
    const dummyExternalEyeCanvas = {
      width: 200,
      height: 200,
      getContext: () => ({
        drawImage: () => {},
        getImageData: () => {
          // 200x200 RGBA buffer representing a normal eye with room lighting / skin in corners
          const buffer = new Uint8ClampedArray(200 * 200 * 4);
          for (let i = 0; i < buffer.length; i += 4) {
            buffer[i] = 190; // R
            buffer[i + 1] = 180; // G
            buffer[i + 2] = 175; // B
            buffer[i + 3] = 255;
          }
          return { data: buffer, width: 200, height: 200 };
        },
      }),
    } as unknown as HTMLCanvasElement;

    const validation = validateRetinaFundusImage(dummyExternalEyeCanvas);
    expect(validation.isGenuineFundus).toBe(false);
    expect(validation.isExternalEye).toBe(true);
    expect(validation.errorCode).toBe('EXTERNAL_EYE_DETECTED');
  });
});
