// This plugin uses 75 DPI

const PAGE_WIDTH = 563
const PAGE_HEIGHT = 750
const SPACING = 10

const frameNodes: SceneNode[] = figma.currentPage.findAll(node => node.type === "FRAME")

var PAGE = 1

class PrintFrames {
  width = 0;
  height = SPACING;
  page = null;
  rowHeight = SPACING;

  addItem(item) {
    if (!this.page){
      this.page = createPage()
    }

    if (this.width + item.width < PAGE_WIDTH){
      this.page.appendChild(item)
      item.x = this.width + SPACING
      item.y = this.height
      this.width+= item.width + SPACING
      this.rowHeight = Math.max(item.height + SPACING, this.rowHeight)
    }
    else if (this.width + item.width > PAGE_WIDTH &&  this.rowHeight + item.height < PAGE_HEIGHT){
      this.page.appendChild(item)
      this.width = SPACING
      this.height+=item.height + SPACING
      item.x = this.width
      item.y = this.height
    }
    else if (this.width + item.width > PAGE_WIDTH &&  this.rowHeight + item.height > PAGE_HEIGHT)
    {
      this.page = createPage()
      this.page.appendChild(item)
      item.x = SPACING
      item.y = SPACING
      this.height = SPACING
      this.width = item.width + SPACING
      this.rowHeight = this.height
    }
    else{
     console.log("Item is too big") 
    }
  }
  
}

// Create a new Printable Page
function createPage(){
  const printFrame = figma.createFrame()
  printFrame.resize(PAGE_WIDTH, PAGE_HEIGHT)
  printFrame.name = `Print Resizer: Page ${PAGE}`
  printFrame.x = PAGE_WIDTH * (PAGE-1)
  PAGE++
  return printFrame
}

const printFrames = new PrintFrames()

// iterate through frames on page
frameNodes.forEach(node=>{
  if (node.type === "FRAME"){
    // iterate through a frames children
    node.children.forEach(child =>{
      printFrames.addItem(child.clone())
    })
  }
})

figma.closePlugin();
