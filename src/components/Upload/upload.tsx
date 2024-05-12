import { FC, ReactNode, useRef, ChangeEvent, useState } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { access } from "fs";
export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';
import  UploadList  from "./uploadList";
import Dragger from "./dragger";
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent: number;
  raw?: File;
  response?: any;
  error?: any;
}

export interface UploadProps {
  /**必选参数, 上传的地址 */
  action: string;
  /**上传的文件列表 */
  defaultFileList?: UploadFile[];
  /**上传文件之前的钩子, 参数为上传的文件, 若返回false 或者 Promise则停止上传 */
  beforeUpload?: (file: File) => boolean | Promise<File>
  /**文件上传时的钩子 */
  onProgress?: (percentage: number, file: UploadFile) => void;
  /**文件上传成功时候的钩子 */
  onSuccess?: (data: any, file: UploadFile) => void;
  /**文件上传失败时的钩子 */
  onError?: (err: any, file: UploadFile) => void;
  /**文件状态改变时的钩子, 上传成功或者失败时都会被 */
  onChange?: (file: UploadFile) => void;
  /**文件列表移除文件时的钩子 */
  onRemove?: (file: UploadFile) => void;
  /**设置上传的请求头部 */
  headers?: {[key:string]:any};
  /**上传的文件字段名 */
  name?: string;
  /**上传时附带的额外参数 */
  data?: {[key: string]: any};
  /**支持发生cookie凭证消息 */
  withCredentials?: boolean;
  /**可选参数, 接收上传的文件类型 */
  accept?: string;
  /**是否支持多选文件 */
  multiple?: boolean;
  /**是否支持拖拽上传 */
  drag?: boolean;
  children: ReactNode;
}

/**
 * 通过点击或者拖拽上传文件
 * ### 引用方法
 * 
 * ~~~js
 * import { Upload } from 'stonedesign'
 * ~~~
 */


export const Upload: FC<UploadProps> = (props) => {

  const {beforeUpload, defaultFileList, name="file", data, action, headers, withCredentials, onProgress, onSuccess, onError, onChange, onRemove, children, drag, multiple, accept} = props
  const fileInput = useRef<HTMLInputElement>(null)
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])
  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if(file.uid === updateFile.uid) {
          return {...file, ...updateFile}
        } else {
          return file
        }
      })
    })
  }

  const handleClick = () => {
    if(fileInput.current) {
      fileInput.current.click()
    }
  }
  const post = (file:File) => {
    //_表示file是一个局部变量, 外部无法访问, 这是一种规定
    let _file: UploadFile = {
      uid: `${Date.now()}upload-file`,
      status:'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    }
    setFileList(prevList => {
      return [_file, ...prevList]
    })
    const formData = new FormData()
    formData.append(name || 'file' , file)
    if(data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
    }
    axios.post(action, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials,
      onUploadProgress: (e: AxiosProgressEvent) => {
        let percentage = (e.total && Math.round((e.loaded * 100) / e.total )) || 0
        if(percentage < 100) {
          updateFileList(_file, {percent: percentage, status:'uploading'})
          _file.status = 'uploading'
          _file.percent = percentage
          if(onProgress) {
            onProgress(percentage, _file)
          }
        }

      }
    }).then(resp => {
      updateFileList(_file, {status: 'success', response: resp.data})
      _file.status = 'success'
      if(onSuccess) {
        onSuccess(resp.data, _file)
      }
      if(onChange) {
        onChange(_file)
      }
    }).catch(err => {
      updateFileList(_file, {status:'error', error:err})
      _file.status = 'error'
      _file.error = err
      if(onError) {
        onError(err, _file)
      }
      if(onChange) {
        onChange(_file)
      }
    })
  }
  const uploadFiles = (files: FileList, test?:boolean) => {
    let postFiles = Array.from(files)
    if(test) {
      console.log('drag', postFiles[0]);
    }
    postFiles.forEach(file => {
      if(!beforeUpload) {
        post(file)
      } else {
        const result = beforeUpload(file)
        if(result && result instanceof Promise) {
          result.then(processedFile => {
            post(processedFile)
          })
        }else if (result !== false) {
          post(file)
        }
      }
    })
  }

  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    if(onRemove) {
      onRemove(file)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files) {
      return
    }
    uploadFiles(files)


  }
  return(
    <div
      className="stone-upload-component"
    >
      <div className="stone-upload-input"
        style={{display:'inline-block'}}
        onClick={handleClick}>
          {drag?
            <Dragger onFile={(files) => uploadFiles(files)}>
              {children}
            </Dragger>:
            children
          }
          <input 
          className="stone-file-input"
          style={{display: 'none'}}
          ref={fileInput}
          onChange={handleFileChange}
          type='file'
          accept={accept}
          multiple={multiple}
          />
      </div>

      <UploadList
        fileList={fileList}
        onRemove={handleRemove}
      />

      
    </div>
  )
}

export default Upload