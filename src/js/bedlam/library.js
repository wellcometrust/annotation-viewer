import Librarian from '../wellcome/Librarian';
import { title, strong } from './components/Quill';

export const library = new Librarian({
  // Retreat
  Retreat: {
    book: 'https://wellcomelibrary.org/iiif/b21160533/manifest',
    page: 62,
    coverPages: 1,
    caption: [
      'Information',
      title('Description of the Retreat'),
      'Samuel Tuke',
      '1813',
      'This book is also presented in the case in front of you',
      strong('WELLCOME LIBRARY')
    ]
  },

  Insanity: {
    book: 'https://wellcomelibrary.org/iiif/b21914655/manifest',
    page: 478,
    coverPages: 9,
    caption: [
      'Information',
      title(`An inquiry concerning the indications of insanity, with
             suggestions for the better protection and care of the insane`),
      'John Conolly',
      '1830',
      'This book is also presented in the case in front of you',
      strong('WELLCOME LIBRARY')
    ]
  },

  Bethlem: {
    book: 'https://dlcs.io/iiif-resource/iiifly/manifest/bedlam-split01',
    coverPages: 5,
    page: 3,
    caption: [
      'Information',
      title('Notes for new Bethlem'),
      'James Tilly Matthews',
      '1811',
      'Ink on paper',
      'These notes are also presented in the case. A transcription is also available.',
      strong('ON LOAN FROM BETHLEM'),
      strong('MUSEUM OF THE MIND')
    ]
  },

  Inferno: {
    book: 'https://wellcometrust.github.io/iiif-manifests/bedlam/s-infernoa00stri.json',
    page: 98,
    coverPages: 13,
    caption: [
      'Information',
      title('Inferno'),
      'August Strindberg',
      '1912',
      'This book is only presented digitally',
      strong('UNIVERSITY OF CALIFORNIA LIBRARIES')
    ]
  }

});
