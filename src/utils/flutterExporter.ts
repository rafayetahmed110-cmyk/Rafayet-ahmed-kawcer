import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FLUTTER_PROJECT_FILES } from '../data/flutterFiles';

export const downloadFlutterProjectZip = async () => {
  const zip = new JSZip();

  // Create folder structure inside zip
  FLUTTER_PROJECT_FILES.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Generate zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'noteflow_flutter_android_app.zip');
};
