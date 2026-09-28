// app\mainPage\ui\renderCPinOrder.js

import {
  createPinRow
} from '../../mainPage/ui/renderPinRow.js';
import {
  createImagePinRow
} from '../../mainPage/ui/renderImagePinRow.js';

import {
  createBottomButtonRow
} from './createBottomButtonRow.js';

import { mainView } from '../../pageControl/config/selectors.js'; // Import av mainView

export function renderCPinOrder(
  currentSectionPortfolio
) {
  console.log(currentSectionPortfolio);

  if (
    !currentSectionPortfolio?.cPinOrder?.length
  ) {
    return;
  }

  // Ta bort en eventuellt tidigare skapad pinContainer så att det inte blir dubbletter
  const existingPinContainer = mainView.querySelector('.c-pin-order-container');
  if (existingPinContainer) {
    existingPinContainer.remove();
  }

  const pinContainer =
    document.createElement('div');

  // Lägg gärna till en specifik klass utöver 'container' för att enkelt hitta/rensa den
  pinContainer.className = 'container c-pin-order-container';

  const columnsContainer =
    document.createElement('div');

  columnsContainer.className = 'pin-columns';

  pinContainer.appendChild(columnsContainer);

  let lastGroupKey = null;

  let sectionDiv = null;

  currentSectionPortfolio.cPinOrder.forEach(
    article => {
      const groupKey =
        `${article.name}||${article.color}`;

      if (groupKey !== lastGroupKey) {
        sectionDiv =
          document.createElement('div');

        sectionDiv.className = 'pin-section';

        const h3 =
          document.createElement('h3');

        h3.textContent =
          `${article.name} ${article.color}`;

        sectionDiv.appendChild(h3);

        columnsContainer.appendChild(
          sectionDiv
        );

        lastGroupKey = groupKey;
      }

      sectionDiv.appendChild(
        createPinRow(article)
      );
    }
  );

  const extraArticles = [
    { name: 'Borrmall', artNr: '903.233.93' },
    { name: 'Stödbeslag', artNr: '702.746.28' },
    { name: 'Diffusionsspärr', artNr: '006.135.42' },
    { name: 'Golvskydd 60', artNr: '402.819.94' },
    { name: 'Stödgavel vit', artNr: '705.160.95' },
    { name: 'Stödgavel svart', artNr: '105.160.98' },
    { name: 'Skarvkoppling dörrar', artNr: '303.669.17' },
    { name: 'Ventilationsgaller', artNr: '702.561.77' },
    { name: 'Ventilerad sockel', artNr: '302.214.58' },
    { name: 'Tub 125', artNr: '600.899.85' },
    { name: 'Tub 150', artNr: '902.502.59' },
    { name: 'FjärilsBuske', artNr: '902.502.59' }
  ];

  const MAX_PER_COLUMN = 6;

  let extraSection = null;

  extraArticles.forEach((article, index) => {
    if (index % MAX_PER_COLUMN === 0) {
      extraSection =
        document.createElement('div');

      extraSection.className = 'pin-section';

      const h3 =
        document.createElement('h3');

      h3.textContent =
        index === 0 ? 'Övrigt' : '.';

      extraSection.appendChild(h3);

      columnsContainer.appendChild(
        extraSection
      );
    }

    extraSection.appendChild(
      createPinRow(article)
    );
  });

  pinContainer.appendChild(
    createBottomButtonRow()
  );

  const extraArtPics = [
    { pic: '80012853.avif', name: 'Lådmatta 150 cm', artNr: '800.128.53' },
    { pic: '50549836.avif', name: 'Lådmatta 50x48 cm', artNr: '505.498.36' },
    { pic: '40551052.avif', name: 'Lådmatta 50x96 cm', artNr: '405.510.52' },
    { pic: '80433207.avif', name: 'Knivställ 20x50 cm', artNr: '804.332.07' },
    { pic: '50600575.avif', name: 'För kryddburkar 10x50 cm', artNr: '506.005.75' },
    { pic: '29627355.avif', name: 'Bestick/krydd 52x50 cm', artNr: '296.273.55' },
    { pic: '39627331.avif', name: 'Bestick/krydd 72x50 cm', artNr: '396.273.31' },
    { pic: '79627353.avif', name: 'Bestick/krydd 52x50 cm', artNr: '796.273.53' },    
    { pic: '29626997.avif', name: 'Bes+red+krydd 72x50 cm', artNr: '296.269.97' },
    { pic: '00618097.avif', name: 'Redskapslåda 10x50 cm', artNr: '006.180.97' },
    { pic: '00618101.avif', name: 'Redskapslåda 20x50 cm', artNr: '006.181.01' },
    { pic: '40459973.avif', name: 'Besticklåda 32x50 cm', artNr: '404.599.73' },
    { pic: '70433104.avif', name: 'Besticklåda 52x50 cm', artNr: '704.331.04' },
    { pic: '39611797.avif', name: 'Bestickl. 72 cm (52+20)', artNr: '396.117.97' },
    { pic: '49611792.avif', name: 'Bestickl. 72 cm (32+2x20)', artNr: '496.117.92' },
    { pic: '09631377.avif', name: 'Redskapsl. 30 cm (20+10)', artNr: '096.313.77' },
    { pic: '19631391.avif', name: 'Red.l. 50 cm (2x20+10)', artNr: '196.313.91' },
    { pic: '59631394.avif', name: 'Red.l. 70 cm (3x20+10)', artNr: '596.313.94' },
    { pic: '50460018.avif', name: 'Redskapslåda 20x50 cm', artNr: '504.600.18' },
    { pic: '10460020.avif', name: 'Redskapslåda 32x50 cm', artNr: '104.600.20' },
    { pic: '09500791.avif', name: 'Bestickl. 52 cm (32+20)', artNr: '095.007.91' },
    { pic: '29500907.avif', name: 'Bestickl. 72 cm (32+2x20)', artNr: '295.009.07' },
    { pic: '10460015.avif', name: 'Redskapslåda 20x31 cm', artNr: '104.600.15' },
    { pic: '70460017.avif', name: 'Besticklåda 32x31 cm', artNr: '704.600.17' },
    { pic: '90613811.avif', name: 'Redskapslåda, 20x47 cm', artNr: '906.138.11' },
    { pic: '10613810.avif', name: 'Bestick, 30-52x47 cm', artNr: '106.138.10' },
    { pic: '59627325.avif', name: 'Bestick, 50-72x47 cm', artNr: '596.273.25' },
    { pic: '60460008.avif', name: 'Hålplatta 60 cm', artNr: '604.600.08' },
    { pic: '00460011.avif', name: 'Hålplatta 80 cm', artNr: '004.600.11' },
    { pic: '10619614.avif', name: 'Lådavdelare', artNr: '106.196.14' },
    { pic: '70486178.avif', name: 'Tallriksställ 15-23 cm', artNr: '704.861.78' },
    { pic: '50486179.avif', name: 'Tallriksställ 19-31 cm', artNr: '504.861.79' },
    { pic: '50503466.avif', name: 'Durkslag, Lillhavet', artNr: '505.034.66' },
    { pic: '00339713.avif', name: 'Durkslag, Norrsjön', artNr: '003.397.13' },
    { pic: '40339711.avif', name: 'Skärbräda, Norrsjön', artNr: '403.397.11' },
    { pic: '60604714.avif', name: 'Flaskställ', artNr: '606.047.14' },
    { pic: '70186090.avif', name: 'Mikrolock', artNr: '701.860.90' },
    { pic: '70154800.avif', name: 'Grytlockshållare', artNr: '701.548.00' },
    { pic: '90506104.avif', name: 'Snurrad', artNr: '905.061.04' },
    { pic: '00569426.avif', name: 'Snurrbricka', artNr: '005.694.26' },
    { pic: '80433882.avif', name: 'Hållbar org. 10 l', artNr: '804.338.82' },
    { pic: '70528611.avif', name: 'MITTLED 80 cm, vit', artNr: '705.286.11' },
    { pic: '60528584.avif', name: 'MITTLED 60 cm, vit', artNr: '605.285.84' },
    { pic: '70528569.avif', name: 'MITTLED 40 cm, vit', artNr: '705.285.69' },
    { pic: '90528498.avif', name: 'MITTLED 30 cm, vit', artNr: '90528498' },
    { pic: '80528446.avif', name: 'MITTLED 20 cm, vit', artNr: '80528446' },
    { pic: '10604165.avif', name: 'Bilresa', artNr: '10604165' },
    { pic: '30604193.avif', name: 'Klippbok, vattenläckage', artNr: '30604193' },
  ];

  const imageSection =
    document.createElement('div');

  imageSection.className =
    'pin-image-section';

  const imageH3 =
    document.createElement('h3');

  imageH3.textContent =
    'Tilläggsartiklar';

  imageSection.appendChild(imageH3);

  const imageGrid =
    document.createElement('div');

  imageGrid.className = 'pin-image-grid';

  extraArtPics.forEach(article => {
    imageGrid.appendChild(
      createImagePinRow(article)
    );
  });

  imageSection.appendChild(imageGrid);

  imageSection.appendChild(
    createBottomButtonRow()
  );

  pinContainer.appendChild(imageSection);

  // ÄNDRING HÄR: Läggs till inuti mainView istället för document.body
  if (mainView) {
    mainView.appendChild(pinContainer);
  } else {
    document.body.appendChild(pinContainer);
  }
}