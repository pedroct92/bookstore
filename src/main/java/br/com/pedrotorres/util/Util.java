package br.com.pedrotorres.util;

import java.util.Base64;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class Util {
	private static final String JPG_64 = "data:image/jpeg;base64,";
	private static final String PNG_64 = "data:image/png;base64,";
	
	public static HttpEntity<byte[]> imgBase64ToHttpEntity(String imgBase64){
		HttpHeaders headers = new HttpHeaders();
	    
	    if(StringUtils.contains(imgBase64, "jpeg")){
	    	headers.setContentType(MediaType.IMAGE_JPEG);
	    }else if(StringUtils.contains(imgBase64, "png")){
	    	headers.setContentType(MediaType.IMAGE_PNG);
	    }
		
	    imgBase64 = StringUtils.replace(imgBase64, JPG_64, StringUtils.EMPTY).replace(PNG_64, StringUtils.EMPTY);

		byte[] image = Base64.getMimeDecoder().decode(imgBase64);
	    
	    headers.setContentLength(image.length);
	    
	    return new HttpEntity<byte[]>(image, headers);
	}
}