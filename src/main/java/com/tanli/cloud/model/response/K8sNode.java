package com.tanli.cloud.model.response;

/**
 * Created by Administrator on 2019/3/26 0026.
 */
public class K8sNode {
    private String name;
    private String outOfDisk;
    private String memoryPressure;
    private String diskPressure;
    private String ready;
    private String iegacyHostIP;
    private String internalIP;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOutOfDisk() {
        return outOfDisk;
    }

    public String getMemoryPressure() {
        return memoryPressure;
    }

    public String getDiskPressure() {
        return diskPressure;
    }

    public String getReady() {
        return ready;
    }


    public void setOutOfDisk(String outOfDisk) {
        this.outOfDisk = outOfDisk;
    }


    public void setMemoryPressure(String memoryPressure) {
        this.memoryPressure = memoryPressure;
    }


    public void setDiskPressure(String diskPressure) {
        this.diskPressure = diskPressure;
    }


    public void setReady(String ready) {
        this.ready = ready;
    }

    public String getIegacyHostIP() {
        return iegacyHostIP;
    }

    public void setIegacyHostIP(String iegacyHostIP) {
        this.iegacyHostIP = iegacyHostIP;
    }

    public String getInternalIP() {
        return internalIP;
    }

    public void setInternalIP(String internalIP) {
        this.internalIP = internalIP;
    }
}
