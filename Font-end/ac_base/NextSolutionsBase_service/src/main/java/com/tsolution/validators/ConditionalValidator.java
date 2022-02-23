package com.tsolution.validators;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.util.StringUtils;

public class ConditionalValidator implements ConstraintValidator<Conditional, Object> {

	private static final Logger log = LogManager.getLogger(ConditionalValidator.class);
	private String selected;
	private String[] required;
	private String message;
	private String[] values;

	@Override
	public void initialize(Conditional requiredIfChecked) {
		this.selected = requiredIfChecked.selected();
		this.required = requiredIfChecked.required();
		this.message = requiredIfChecked.message();
		this.values = requiredIfChecked.values();
	}

	@Override
	public boolean isValid(Object objectToValidate, ConstraintValidatorContext context) {
		boolean valid = true;
		try {
			Object actualValue = BeanUtils.getProperty(objectToValidate, this.selected);
			if (Arrays.asList(this.values).contains(actualValue)) {
				for (String propName : this.required) {
					Object requiredValue = BeanUtils.getProperty(objectToValidate, propName);
					valid = (requiredValue != null) && !StringUtils.isEmpty(requiredValue);
					ConditionalValidator.log.info("value: {}", requiredValue);
					if (!valid) {
						context.disableDefaultConstraintViolation();
						context.buildConstraintViolationWithTemplate(this.message).addPropertyNode(propName)
								.addConstraintViolation();
						if ("".equals(this.message)) {
							this.message = String.format("%s required", propName);
						}
					}
				}
			}
		} catch (IllegalAccessException e) {
			ConditionalValidator.log.error("Accessor method is not available for class : {}, exception : {}",
					objectToValidate.getClass().getName(), e);
			e.printStackTrace();
			return false;
		} catch (NoSuchMethodException e) {
			ConditionalValidator.log.error("Field or method is not present on class : {}, exception : {}",
					objectToValidate.getClass().getName(), e);
			e.printStackTrace();
			return false;
		} catch (InvocationTargetException e) {
			ConditionalValidator.log.error("An exception occurred while accessing class : {}, exception : {}",
					objectToValidate.getClass().getName(), e);
			e.printStackTrace();
			return false;
		}
		return valid;
	}
}