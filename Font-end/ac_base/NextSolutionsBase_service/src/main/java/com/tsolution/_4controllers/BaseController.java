package com.tsolution._4controllers;

import org.springframework.beans.factory.annotation.Autowired;

import com.tsolution.utils.Translator;

public abstract class BaseController {

	@Autowired
	protected Translator translator;
}
