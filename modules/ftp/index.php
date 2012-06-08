<div style="border-top:white solid 1px;border-right:white dashed 1px;border-left:white dashed 1px;height:500;width:900;margin-left:auto;margin-right:auto;">
<object width="900" height="500" classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" codebase="http://java.sun.com/products/plugin/autodl/jinstall-1_4-windows-i586.cab#Version=1,4,2,0" >
    <param name="code" value="com.jscape.ftpapplet.FtpApplet.class">
    <param name="archive" value="modules/ftp/sftpapplet.jar">
    <param name="scriptable" value="false">
    <param name="hostname" value="coloc.no-ip.org">
    <param name="username" value="<?= $slog; ?>">
    <param name="password" value="<?= $spass; ?>">
    <param name="bgColor" value="99cccc">
    <param name="autoConnect" value="true">	
    <comment>
	<embed 
            type="application/x-java-applet;version=1.4" \
            code="com.jscape.ftpapplet.FtpApplet.class" \
            archive="modules/ftp/sftpapplet.jar" \
            name="ftpapplet" \
            width="900" \
            height="500" \
		    scriptable="false" \
			hostname="coloc.no-ip.org"
			username="<?= $slog; ?>" \
			password="<?= $spass; ?>" \
			bgColor = "99cccc"
			autoConnect = "true";
		    pluginspage = "http://java.sun.com/products/plugin/index.html#download">
		    <noembed>            
            </noembed>
	</embed>
    </comment>
</object>
</div>








