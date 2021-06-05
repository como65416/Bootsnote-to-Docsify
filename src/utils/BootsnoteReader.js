const fs = require('fs');
const glob = require('glob');

class BoosnoteReader{
  basePath = '';

  constructor(path) {
    this.basePath = path.replace(/\/+$/, '') + '/';

    const configPath = this.basePath + '/boostnote.json';
    if (!fs.existsSync(configPath)) {
      throw new Error(configPath + ' is not exists');
    }
  }

  getAttachmentsPath() {
    return this.basePath + 'attachments/';
  }

  getFolderConfig() {
    const configPath = this.basePath + '/boostnote.json';
    const config = JSON.parse(fs.readFileSync(configPath));

    return config.folders;
  }

  getNotes() {
    const files = glob.sync(this.basePath + 'notes/*.cson');
    const notes = [];
    for (let file of files) {
      const content = fs.readFileSync(file, 'utf8');
      notes.push(this.parseContent(content));
    }

    return notes;
  }

  parseContent(content) {
    let title = content.match(/title: "(.*?)"\n/s)[1];
    let noteContent = content.match(/content: '''\n(.*?)\n'''\n/s)[1]
      .replace(/\n  /g, '\n');
    let folderKey = content.match(/folder: "(.*?)"\n/s)[1];

    return {
      title: title,
      content: noteContent,
      folderKey: folderKey,
    }
  }
}

module.exports = BoosnoteReader;
