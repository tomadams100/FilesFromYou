import fs from 'fs';

export class DbSvc {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.initFile();
  }

  private initFile() {
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, '{}', 'utf8');
      }
    } catch (error) {
      console.error('Error initializing file:', error);
    }
  }

  public readData() {
    try {
      const fileContent = fs.readFileSync(this.filePath, 'utf8');
      if (fileContent.trim() === '') {
        return {};
      }
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading data from file:', error);
      return {};
    }
  }

  public writeData(key: string, value: string) {
    try {
      const existingData = this.readData();

      existingData[key] = value;

      const jsonString = JSON.stringify(existingData, null, 2);

      fs.writeFileSync(this.filePath, jsonString, 'utf8');

      console.log('Data written to file successfully');
    } catch (error) {
      console.error('Error writing data to file:', error);
    }
  }
}
