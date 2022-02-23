package com.example.filedemo.controller;

import com.example.filedemo.dto.dtoOrderDetail;
import com.example.filedemo.dto.dtoProduct;
import com.example.filedemo.dto.dtoProductNew;
import com.example.filedemo.dto.responseUser;
import com.example.filedemo.entites.*;
import com.example.filedemo.payload.UploadFileResponse;
import com.example.filedemo.repository.*;
import com.example.filedemo.service.FileStorageService;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.xml.ws.Response;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("api/user")
public class UserController extends BaseResource<User> {
    private static final Logger logger = LoggerFactory.getLogger(FileController.class);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AttachMentRepository attachMentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private FileStorageService fileStorageService;



    ////////////////  User

    @PostMapping
    @RequestMapping("/register")
    public ResponseEntity<?> search(@RequestBody User users) {
        String username = users.getUsername();
        String password = users.getPassword();
        User checkLogin = new User();
        checkLogin = userRepository.findByUsernameAndPassword(username, password);
        if (checkLogin != null) {
            return responseError("user đã ton tai", HttpStatus.BAD_REQUEST);
        } else {
            Role role = roleRepository.findByName("Customer");
            if (role== null){
                Role customer = new Role();
                customer.setName("Customer");
                role =  roleRepository.save(customer);
                Role admin = new Role();
                admin.setName("Admin");
                roleRepository.save(admin);
            }
            User user = new User();
            user.setUsername(username);
            user.setStatus(0);
            user.setPassword(password);
            user.setCreateDate(new Date());
            user.setRoles(role);

            userRepository.save(user);
            return responseSuccess("dang Ky thanh cong ");
        }


    }

    @PostMapping
    @RequestMapping("/UpdateUser")
    public ResponseEntity<?> updateUser(@RequestParam("address") String address,
                                        @RequestParam("email") String email,
                                        @RequestParam("image") MultipartFile image,
                                        @RequestParam("phone") String phone,
                                        @RequestParam("id") Integer id
    ) {
        User user = userRepository.findById(id);
        if (user != null) {
            return responseError("user đã ton tai", HttpStatus.BAD_REQUEST);
        } else {

            if (image.getContentType() != null) {

                String fileName = fileStorageService.storeFile(image);
                String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/user/downloadFile/")
                        .path(fileName)
                        .toUriString();
                user.setImage(fileDownloadUri);
            }
            user.setAddress(address);
            user.setEmail(email);
            user.setPhone(phone);

            userRepository.save(user);
            return responseSuccess("Update user thành công ! ");
        }


    }

    @PostMapping
    @RequestMapping("/getUserId")
    public ResponseEntity<?> getUser(@RequestParam("id") Integer id) {
        User user = userRepository.findById(id);
            return responseSuccess(user,"Tìm kiếm thành công ! ");
    }

    @PostMapping("/searchUser")
    public ResponseEntity<?> searchUser(@RequestParam("name") String name,
                                           @RequestParam("phone") String phone,
                                           @RequestParam("status") Integer status,
                                           @RequestParam("roles") Integer roles,
                                           @RequestParam("pageNumber") Integer pageNumber,
                                           @RequestParam("pageSize") Integer pageSize,
                                           Pageable pageable
    ) {

        Page<User> products = userRepository.findUser(name,phone,status,roles,pageNumber,pageSize,new PageRequest(pageNumber, pageSize));
        return new ResponseEntity<>(BaseResponse.success(products, "Search thanh cong"), HttpStatus.OK);

    }


    @PostMapping("/login")
    public ResponseEntity<?> createEmployee(@RequestBody User user
    ) {

        User checkLogin =  userRepository.findByUsernameAndPassword(user.getUsername(),user.getPassword());

        if(checkLogin == null){
            return responseError("user khong ton tai", HttpStatus.BAD_REQUEST);
        }else{
            return responseSuccess(checkLogin,"dang nhap thanh cong");
        }
    }


    //////////////// Product

    @PostMapping("/searchProduct")
    public ResponseEntity<?> searchProduct(@RequestParam("name") String name,
                                           @RequestParam("productType") Integer productType,
                                           @RequestParam("fromDate") String fromDate,
                                           @RequestParam("toDate") String toDate,
                                           @RequestParam("pageNumber") Integer pageNumber,
                                           @RequestParam("pageSize") Integer pageSize,
                                           Pageable pageable
    ) {



//        Page<Product> product = productRepository.findAllProduct(name,new PageRequest(0, 10));
        Page<Product> products = userRepository.findProduct(name,productType,fromDate,toDate,pageNumber,pageSize,new PageRequest(0, 10));
        return new ResponseEntity<>(BaseResponse.success(products, "Search thanh cong"), HttpStatus.OK);

    }


    @PostMapping("/createProduct")
    public ResponseEntity<?> createProduct(
            @RequestParam(value = "images", required=false) List<MultipartFile> images,
            @RequestParam("quantity") int quantity,
            @RequestParam("productType") int productType,
            @RequestParam("price") int price,
            @RequestParam("name") String name,
            @RequestParam("id") Integer id
    ) throws Exception {

        String[] result = name.split(",");
        Product productName = productRepository.findByName(result[0]);
        if (productName != null && id == null) {
            return new ResponseEntity<>("Tên sản phẩm đã tồn tại", HttpStatus.BAD_REQUEST);
        }

        List<String> listImage = new ArrayList<String>();
        Set<AttachMent> attachMents = new HashSet<AttachMent>();
        if (images.size() > 0) {
            for (MultipartFile image : images) {
                if (image.getContentType() != null) {
                    String fileName = fileStorageService.storeFile(image);
                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/api/user/downloadFile/")
                            .path(fileName)
                            .toUriString();
                    listImage.add(fileDownloadUri);
                    AttachMent attachMent = new AttachMent();
                    attachMent.setCreateDate(new Date());
                    attachMent.setUrl(fileDownloadUri);
                    attachMent = attachMentRepository.save(attachMent);
                    attachMents.add(attachMent);
                }
            }
        }

        if (id == null) {
            Product productNew = new Product();
            productNew.setCount(quantity);
            productNew.setProductTypes(productType);
            productNew.setName(result[0]);
            productNew.setPrice(price);
            productNew.setAttachMents(attachMents);
            productNew.setCreateDate(new Date());
            productRepository.save(productNew);
            return responseSuccess("Bạn đẫ tạo thành công sản phẩm");

        } else {
            Product productFindId = productRepository.findById(id);
            productFindId.setCount(quantity);
            productFindId.setProductTypes(productType);
            productFindId.setName(result[0]);
            productFindId.setPrice(price);
            productFindId.setCreateDate(new Date());
            productRepository.save(productFindId);
            return responseSuccess("Bạn đẫ update thành công");
        }
    }

    @PostMapping("/deleteProduct")
    public ResponseEntity<?> deleteProduct(
            @RequestParam("id") Integer id
    ) throws Exception {
        Product productName = productRepository.findById(id);
        if (productName == null) {
            return new ResponseEntity<>("Sản phẩm không tồn tại", HttpStatus.BAD_REQUEST);
        } else {
            productRepository.delete(productName);
            return responseSuccess("Bạn đẫ xóa thành công");
        }
    }



    /////////////////Product type

    @GetMapping
    @RequestMapping("/getProductTypeAll")
    public ResponseEntity<?> getProductTypeAll() {
        List<ProductType> productType = productTypeRepository.findAll();
        return responseSuccessProductTypeList( productType,"Bạn đẫ search thành công");
    }

    @PostMapping
    @RequestMapping("/getProductId")
    public ResponseEntity<?> getProductId(@RequestParam("id") Integer id) {
        Product product = productRepository.findById(id);
        return responseSuccessProduct( product,"Bạn đẫ search thành công");
    }

    @PostMapping("/searchProductType")
    public ResponseEntity<?> searchUser(@RequestParam("name") String name,
                                        @RequestParam("status") Integer status,
                                        @RequestParam("fromDate") String fromDate,
                                        @RequestParam("toDate") String toDate,
                                        @RequestParam("pageNumber") Integer pageNumber,
                                        @RequestParam("pageSize") Integer pageSize,
                                        Pageable pageable
    ) {

        Page<ProductType> products = userRepository.findProductType(name,status,fromDate,toDate,pageNumber,pageSize,new PageRequest(pageNumber, pageSize));
        return new ResponseEntity<>(BaseResponse.success(products, "Search thanh cong"), HttpStatus.OK);

    }

    @PostMapping("/createProductType")
    public ResponseEntity<?> createProductType(
            @RequestParam(value = "image", required=false) MultipartFile image,
            @RequestParam("name") String name,
            @RequestParam("id") Integer id
    ) throws Exception {


        ProductType productName = productTypeRepository.findByName(name);
        if (productName != null && id == null) {
            return new ResponseEntity<>("Tên sản phẩm đã tồn tại", HttpStatus.BAD_REQUEST);
        }
        String fileDownloadUri = "";
        if (image != null) {
            if (image.getContentType() != null) {
                String fileName = fileStorageService.storeFile(image);
                fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/user/downloadFile/")
                        .path(fileName)
                        .toUriString();
            }
        }


        if (id == null) {
            ProductType productTypeNew = new ProductType();
            productTypeNew.setName(name);
            if(!fileDownloadUri.isEmpty()){
                productTypeNew.setImage(fileDownloadUri);
            }
            productTypeNew.setStatus(0);
            productTypeNew.setCreateDate(new Date());
            productTypeRepository.save(productTypeNew);
            return responseSuccess("Bạn đẫ tạo thành công loại sản phẩm");

        } else {
            ProductType productTypeFindId = productTypeRepository.findById(id);
            productTypeFindId.setName(name);
            productTypeFindId.setStatus(0);
            if(!fileDownloadUri.isEmpty()){
                productTypeFindId.setImage(fileDownloadUri);
            }
            productTypeFindId.setCreateDate(new Date());
            productTypeRepository.save(productTypeFindId);
            return responseSuccess("Bạn đẫ update thành công");
        }
    }

    @GetMapping
    @RequestMapping("/getProductTypeId")
    public ResponseEntity<?> getProductTypeId(@RequestParam("id") Integer id) {
        ProductType productType = productTypeRepository.findById(id);
        return responseSuccessProductType( productType,"Bạn đẫ xóa thành công");
    }



    //////////////////////Order and Order Detail


    @PostMapping("/createOrder")
    public ResponseEntity<?> createOrder(
            @RequestBody Order order) throws Exception {


        order.setOrderDate(new Date());
        order.setStatusOrder(0);
        orderRepository.save(order);

        return responseSuccess("Bạn đẫ tạo thành công đơn hàng");

    }

    @PostMapping("/searchOrder")
    public ResponseEntity<?> searchOrder(@RequestParam("name") String name,
                                        @RequestParam("status") Integer status,
                                        @RequestParam("fromDate") String fromDate,
                                        @RequestParam("toDate") String toDate,
                                        @RequestParam("pageNumber") Integer pageNumber,
                                        @RequestParam("pageSize") Integer pageSize,
                                        Pageable pageable
    ) {

        Page<Order> order = userRepository.findOrder(name,status,fromDate,toDate,pageNumber,pageSize,new PageRequest(pageNumber, pageSize));
        return new ResponseEntity<>(BaseResponse.success(order, "Search thanh cong"), HttpStatus.OK);

    }

    @PostMapping
    @RequestMapping("/getOrderId")
    public ResponseEntity<?> getOrderId(@RequestParam("id") Integer id) {
        Order order = orderRepository.findById(id);
        return responseSuccessOrder( order,"Bạn đẫ search thành công");
    }











    /////// Upload file
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
