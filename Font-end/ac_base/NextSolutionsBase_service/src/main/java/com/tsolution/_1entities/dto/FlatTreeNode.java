package com.tsolution._1entities.dto;

import java.util.List;

public class FlatTreeNode {
	private String value;
	private String displayValue;
	private List<FlatTreeNode> children;

	public FlatTreeNode() {
	}

	public FlatTreeNode(String value, String displayValue, List<FlatTreeNode> children) {
		this.value = value;
		this.displayValue = displayValue;
		this.children = children;
	}

	public String getValue() {
		return this.value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDisplayValue() {
		return this.displayValue;
	}

	public void setDisplayValue(String displayValue) {
		this.displayValue = displayValue;
	}

	public List<FlatTreeNode> getChildren() {
		return this.children;
	}

	public void setChildren(List<FlatTreeNode> children) {
		this.children = children;
	}

}
