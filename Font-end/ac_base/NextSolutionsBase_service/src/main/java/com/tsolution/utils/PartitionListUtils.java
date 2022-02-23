package com.tsolution.utils;

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public final class PartitionListUtils<T> extends AbstractList<List<T>> {

	private static final Logger logger = LogManager.getLogger(PartitionListUtils.class);
	private final List<T> list;
	private final int chunkSize;

	public PartitionListUtils(List<T> list, int chunkSize) {
		this.list = new ArrayList<>(list);
		this.chunkSize = chunkSize;
	}

	public static <T> PartitionListUtils<T> ofSize(List<T> list, int chunkSize) {
		return new PartitionListUtils<>(list, chunkSize);
	}

	@Override
	public List<T> get(int index) {
		int start = index * this.chunkSize;
		int end = Math.min(start + this.chunkSize, this.list.size());

		if (start > end) {
			PartitionListUtils.logger.error(new IndexOutOfBoundsException(
					"Index " + index + " is out of the list range <0," + (this.size() - 1) + ">"));
			return new ArrayList<>();
		}

		return new ArrayList<>(this.list.subList(start, end));
	}

	@Override
	public int size() {
		return (int) Math.ceil((double) this.list.size() / (double) this.chunkSize);
	}

	@Override
	public boolean equals(Object o) {
		return super.equals(o);
	}

	@Override
	public int hashCode() {
		return super.hashCode();
	}
}