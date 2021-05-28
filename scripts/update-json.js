const fs = require('fs');
const csv = require('csv-parser');

module.exports = {
  updateJson: () => {
    console.log('running update-json');
    let updatedJsonData = [];
    let fileNumber = 1;

    fs.createReadStream('src/scripts/json-filelist.csv')
      .pipe(csv())
      .on('data', (row) => {
        const rawData = fs.readFileSync('src/json-files/' + row.jsonFile);
        const jsonData = JSON.parse(rawData);
        const newJsonData = jsonData.map((item) => {
          if (!item.app_metadata) {
            item.app_metadata = {
              tng_id: item.app_metadata_tng_id,
            };
          }

          return item;
        });

        updatedJsonData = newJsonData;

        console.log('Writing to new file:', row.jsonFile);

        const humanReadableJson = JSON.stringify(newJsonData, null, 2);
        const path = row.jsonFile;
        const buffer = new Buffer.from(humanReadableJson);

        fs.writeFileSync(
          `src/scripts/updated-json-files/${row.jsonFile}`,
          humanReadableJson
        );
      })
      .on('end', () => {
        console.log('Process is now finished', updatedJsonData);
      });
  },
};
