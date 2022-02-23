package com.tsolution.sso._4controller;

import java.util.List;
import java.util.Optional;

import com.tsolution.sso._1entities.Permission;
import com.tsolution.sso._2repository.MenuRepository;
import com.tsolution.sso._2repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.tsolution.sso._1entities.Menu;
import com.tsolution.sso._3service.MenuService;
import com.tsolution.sso.exceptions.BusinessException;

@Controller
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private PermissionRepository permissionRepository;
	@GetMapping("/{id}")
	public ResponseEntity<Object> getOne(@PathVariable("id") Long menuId) {
		return this.menuService.getOne(menuId);
	}

	@GetMapping("/find")
	public ResponseEntity<Object> find(@RequestParam(value = "clientId", required = false) String clientId,
									   @RequestParam(value = "text", required = false) String text,
									   @RequestParam(value = "pageNumber") Integer pageNumber, @RequestParam(value = "pageSize") Integer pageSize)
			throws BusinessException {
		text = text == null ? "" : text;
		clientId = clientId == null ? "" : clientId;

		Menu menu = new Menu();
		menu.setClientId(clientId);
		menu.setUrl(text);
		menu.setCode(text);
		menu.setAppType(text);
		return this.menuService.find(menu, PageRequest.of(pageNumber - 1, pageSize));
	}

	@GetMapping("/getAll")
	public ResponseEntity<Object> getAll() {
		return this.menuService.getAll();
	}

	@GetMapping("/client-id")
	public ResponseEntity<Object> findByClientId(@RequestParam(value = "client-id") String clientId) {
		return this.menuService.findByClientId(clientId);
	}

	@PostMapping
	public ResponseEntity<Object> create(@RequestBody Optional<Menu> oMenuEntity) throws BusinessException {
		if (oMenuEntity.isPresent()) {
			return this.menuService.create(oMenuEntity.get());
		}
		throw new BusinessException(BusinessException.COMMON_INPUT_INFO_INVALID);
	}

	@PostMapping("/create-list")
	public ResponseEntity<Object> createList(@RequestBody List<Menu> menuList) throws BusinessException {
		if (!menuList.isEmpty()) {
			return this.menuService.createList(menuList);
		}
		throw new BusinessException(BusinessException.COMMON_INPUT_INFO_INVALID);
	}



	@DeleteMapping("/{id}")
	public ResponseEntity<Object> delete(@PathVariable("id") Long id) throws BusinessException {
		return this.menuService.delete(id);
	}

    @PostMapping("/clone-from-DBS")
    public ResponseEntity<?> cloneFromDBS(@RequestBody List<Menu> menus) {
        return ResponseEntity.ok(menuRepository.saveAll(menus));
    }

    @PostMapping("/clone-from-DBS-Per")
    public ResponseEntity<?> clonePermission(@RequestBody List<Permission> permissions) {
        return ResponseEntity.ok(permissionRepository.saveAll(permissions));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable("id") Long id, @RequestBody Optional<Menu> oMenuEntity)
            throws BusinessException {
        if (oMenuEntity.isPresent()) {
            return this.menuService.update(id, oMenuEntity.get());
        }
        throw new BusinessException(BusinessException.COMMON_INPUT_INFO_INVALID);
    }

	@DeleteMapping("/reference/{id}")
	public ResponseEntity<Object> deleteWithReference(@PathVariable("id") Long id) throws BusinessException {
		return this.menuService.deleteWithReference(id);
	}

}
