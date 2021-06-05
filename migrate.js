const { program } = require('commander');
const fs = require('fs');
const fse = require('fs-extra');
const BootsnoteReader = require('./src/utils/BootsnoteReader');
const DocsifyGenerater = require('./src/utils/DocsifyGenerater.js')

async function main() {
  program
    .requiredOption('-f, --from <path>', 'input bootsnote folder')
    .parse(process.argv);

  const options = program.opts();
  const bootsnoteReader = new BootsnoteReader(options.from);

  const folderConfig = bootsnoteReader.getFolderConfig();
  const notes = bootsnoteReader.getNotes();

  // init folder
  if (fs.existsSync(__dirname + '/dist/')) {
    fse.removeSync(__dirname + '/dist/');
  }
  fse.copySync(__dirname + '/docsify-template/', __dirname + '/dist/')

  // output pages data
  const baseOutDir = __dirname + '/dist/';
  const docsifyGenerater = new DocsifyGenerater(folderConfig, notes);

  const sidebarContent = docsifyGenerater.generateSidebar();
  fs.writeFileSync(baseOutDir + '_sidebar.md', sidebarContent);

  const outputNotes = docsifyGenerater.generateOutputNotes();
  for(let outputNote of outputNotes) {
    const dirPath = baseOutDir + outputNote.folder + '/';
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(dirPath + outputNote.filename, outputNote.content);
  }

  fse.copySync(bootsnoteReader.getAttachmentsPath(), baseOutDir + '_attachments')
}

main().catch(err => {
  console.log(err);
});
