export class UploadModel {
  id?:number;
  name: string;
  type?: string;
  binary: File|null;
  previewValue: string | ArrayBuffer | null;

  constructor(name: string, binary: File|null, previewValue: string | ArrayBuffer | null, type?: string,
              id?:number) {
    this.name = name;
    this.binary = binary;
    this.previewValue = previewValue;
    this.type = type;
    this.id = id;
  }
  static init(url: string){
    const type = UploadModel.getFileType(url);
    const name = UploadModel.getFileName(url);
    return new UploadModel(name?name:'', null, url, type);
  }

  static getFileType(url: string) {
    const fileTypes = url ? url.split('.') : [];
    const type = fileTypes.length > 0 ? fileTypes[fileTypes.length - 1] : '';
    if (['png', 'jpg', 'jpeg', 'img'].includes(type.toLowerCase())) {
      return 'image/' + type;
    } else if ('pdf' === type.toLowerCase()) {
      return 'application/pdf';
    }
    return type;
  }

  static getFileName(url: string) {
    let fileName = url ? url.split('/') : [];

    return fileName.pop();
  }
}
