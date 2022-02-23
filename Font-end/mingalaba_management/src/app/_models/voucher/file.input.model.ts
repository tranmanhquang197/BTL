
export class CreateFileInput {
  id?: number | undefined;
  status?: number | undefined;
  file_name: string | undefined;
  file_url: string | undefined;
  file_type: string | undefined;
  height?: number | undefined;
  width?: number | undefined;
  description?: string | undefined;
  file_size?: number | undefined;
  duration?: string | undefined;


  constructor(file_name: string, file_url : string,file_size: number) {
    this.file_name = file_name;
    this.file_url = file_url;
    this.file_type = this.getFileTypeFromFileName(file_name);
    this.file_size = Number(file_size);
  }
  getFileTypeFromFileName(fileName: string| undefined):string{
    if(fileName){
      return fileName.split('.')[1];
    }
    return '';
  }

}
