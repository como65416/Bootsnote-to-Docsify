class DocsifyGenerater{
  folderConfig = [];
  notes = [];

  constructor(folderConfig, notes) {
    this.folderConfig = folderConfig;
    this.notes = notes;
  }

  generateSidebar() {
    let folderNotes = {};
    for(let note of this.notes) {
      folderNotes[note.folderKey] = folderNotes[note.folderKey] ?? [];
      folderNotes[note.folderKey].push(note);
    }

    let sidebarContent = '';
    for(let config of this.folderConfig) {
      sidebarContent += '* [' + config.name + ']()\n';
      const foldername = this.convertFilename(config.name);
      for(let note of folderNotes[config.key] ?? []) {
        const filename = this.convertFilename(note.title);
        sidebarContent += '  * [' + note.title + '](' + foldername + '/' + filename + '.md)\n';
      }
    }

    return sidebarContent;
  }

  generateOutputNotes() {
    let folderMap = {}
    for(let config of this.folderConfig) {
      folderMap[config.key] = this.convertFilename(config.name);
    }

    let notes = [];
    for(let note of this.notes) {
      notes.push({
        folder: folderMap[note.folderKey],
        filename: this.convertFilename(note.title) + '.md',
        content: note.content.replace(/:storage/g, '../_attachments'),
      })
    }

    return notes;
  }

  convertFilename(title) {
    return title.replace(/[ \t]/g, '-');
  }
}

module.exports = DocsifyGenerater;
