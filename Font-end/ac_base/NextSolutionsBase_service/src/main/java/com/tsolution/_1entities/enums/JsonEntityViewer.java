package com.tsolution._1entities.enums;

import java.util.Map;

import com.google.common.collect.ImmutableMap;

public class JsonEntityViewer {
	public interface Human {
		public interface Summary {
		}

		public interface Detail extends Summary {
		}
	}

	public interface Custom extends Human.Summary {

	}

	public interface GOD extends Human.Detail {
	}

	public interface CustomDetail extends Human.Detail {
	}

	public static final Map<String, Class<? extends Human.Summary>> MapRequest = ImmutableMap.<String, Class<? extends Human.Summary>>builder()
//			.put("/product-packings/group-by-expire-date", Human.ProductPackingGroupByExpireDate.class)
			.build();

}
