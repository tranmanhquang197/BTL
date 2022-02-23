package com.example.filedemo.controller;

import com.example.filedemo.dto.responseProduct;
import com.example.filedemo.payload.UploadFileResponse;
import com.example.filedemo.repository.*;
import com.example.filedemo.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.persistence.Column;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import com.example.filedemo.entites.Product;
import com.example.filedemo.entites.ProductType;
import com.example.filedemo.repository.ProductRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/api/product")
public class FileController  extends BaseResource<Product>{

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;



    @Column
    private String operatingSystem;


    @Column
    private String frontCamera;

    @Column
    private String rearCamera;

    @Column
    private String  cpu;

    @Column
    private String ram;

    @Column
    private String internalMemory;


    @Column
    private String pin;

    @Column
    private String memoryStick;

    @Column
    private String sim;
    @PostMapping()
    public ResponseEntity<?> post(@RequestParam("description")  String description ,
                                  @RequestParam("image") MultipartFile image ,
                                  @RequestParam("name") String name,
                                  @RequestParam("productType") String productType,
                                  @RequestParam("price") int price,
                                  @RequestParam("main") int main,
                                  @RequestParam("sale") int sale,
                                  @RequestParam("count") int count,
                                  @RequestParam("image1") MultipartFile image1,
                                  @RequestParam("image2") MultipartFile image2,
                                  @RequestParam("image3") MultipartFile image3,
                                  @RequestParam("screen") String screen,
                                  @RequestParam("operatingSystem") String operatingSystem,
                                  @RequestParam("frontCamera") String frontCamera,
                                  @RequestParam("rearCamera") String rearCamera,
                                  @RequestParam("cpu") String cpu,
                                  @RequestParam("ram") String ram,
                                  @RequestParam("internalMemory") String internalMemory,
                                  @RequestParam("pin") String pin,
                                  @RequestParam("memoryStick") String memoryStick,
                                  @RequestParam("sim") String sim
                                    ) {
        String fileName = fileStorageService.storeFile(image);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName)
                .toUriString();
        UploadFileResponse imageMain = new  UploadFileResponse(fileName, fileDownloadUri,
                image.getContentType(), image.getSize());

        String fileName1 = fileStorageService.storeFile(image1);

        String fileDownloadUri1 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName1)
                .toUriString();
        UploadFileResponse imageMain1 = new  UploadFileResponse(fileName1, fileDownloadUri1,
                image.getContentType(), image.getSize());

        String fileName2 = fileStorageService.storeFile(image2);

        String fileDownloadUri2 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName2)
                .toUriString();
        UploadFileResponse imageMain2 = new  UploadFileResponse(fileName2, fileDownloadUri2,
                image.getContentType(), image.getSize());

        String fileName3 = fileStorageService.storeFile(image3);

        String fileDownloadUri3 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName3)
                .toUriString();
        UploadFileResponse imageMain3 = new  UploadFileResponse(fileName3, fileDownloadUri3,
                image.getContentType(), image.getSize());
        Product checkEmpty =  productRepository.findByName( name );

        return responseError("product already exist", HttpStatus.BAD_REQUEST);
    }


    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName)
                .toUriString();

        return new UploadFileResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    @PostMapping("/{id}/detail")
    public ResponseEntity<?>  postProductDetail(@PathVariable("id") int id) {

        Product productCheck = productRepository.findById(id);

        if(productCheck != null){

             return responseSuccess(productCheck,"Post success!");


        }else{
            return responseError("product already exist", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/uploadMultipleFiles")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("image") MultipartFile image,
                                                        @RequestParam("image1") MultipartFile image1,
                                                        @RequestParam("image2") MultipartFile image2,
                                                        @RequestParam("image3") MultipartFile image3
    ) {

        String fileName = fileStorageService.storeFile(image);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();
        UploadFileResponse imageMain = new  UploadFileResponse(fileName, fileDownloadUri,
                image.getContentType(), image.getSize());

        String fileName1 = fileStorageService.storeFile(image);

        String fileDownloadUri1 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();
        UploadFileResponse imageMain1 = new  UploadFileResponse(fileName, fileDownloadUri,
                image.getContentType(), image.getSize());

        String fileName2 = fileStorageService.storeFile(image);

        String fileDownloadUri2 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();
        UploadFileResponse imageMain2 = new  UploadFileResponse(fileName, fileDownloadUri,
                image.getContentType(), image.getSize());

        String fileName3 = fileStorageService.storeFile(image);

        String fileDownloadUri3 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();
        UploadFileResponse imageMain3 = new  UploadFileResponse(fileName, fileDownloadUri,
                image.getContentType(), image.getSize());
        List<UploadFileResponse> lists  = new ArrayList<>();
//        List<UploadFileResponse> lists = Arrays.asList(files)
//                .stream()
//                .map(file -> uploadFile(file))
//                .collect(Collectors.toList());
        lists.add(imageMain);
        lists.add(imageMain1);
        lists.add(imageMain2);
        lists.add(imageMain3);
        return lists;
    }








   @DeleteMapping("/{id}")
    public  ResponseEntity<?> delete(@PathVariable(value = "id") int id){
        Product product = productRepository.findById( id );
        productRepository.delete(product);
        return responseSuccess("Delete success");

    }



    @PutMapping("/{id}")
    public ResponseEntity<?> put(@PathVariable(value = "id") int id,

                                  @RequestParam("image") MultipartFile image ,
                                  @RequestParam("name") String name,
                                  @RequestParam("productType") String productType,
                                  @RequestParam("price") int price,
                                  @RequestParam("main") int main,
                                  @RequestParam("sale") int sale,
                                  @RequestParam("count") int count,
                                  @RequestParam("image1") MultipartFile image1,
                                  @RequestParam("image2") MultipartFile image2,
                                  @RequestParam("image3") MultipartFile image3,
                                  @RequestParam("description")  String description ){

        Product product = productRepository.findById( id );

        String fileName = fileStorageService.storeFile(image);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName)
                .toUriString();
        UploadFileResponse imageMain = new  UploadFileResponse(fileName, fileDownloadUri,
                image.getContentType(), image.getSize());

        String fileName1 = fileStorageService.storeFile(image1);

        String fileDownloadUri1 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName1)
                .toUriString();
        UploadFileResponse imageMain1 = new  UploadFileResponse(fileName1, fileDownloadUri1,
                image.getContentType(), image.getSize());

        String fileName2 = fileStorageService.storeFile(image2);

        String fileDownloadUri2 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName2)
                .toUriString();
        UploadFileResponse imageMain2 = new  UploadFileResponse(fileName2, fileDownloadUri2,
                image.getContentType(), image.getSize());

        String fileName3 = fileStorageService.storeFile(image3);

        String fileDownloadUri3 = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/product/downloadFile/")
                .path(fileName3)
                .toUriString();
        UploadFileResponse imageMain3 = new  UploadFileResponse(fileName3, fileDownloadUri3,
                image.getContentType(), image.getSize());




        productRepository.save(product);


        return responseSuccess("Delete success");
    }




    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

}
